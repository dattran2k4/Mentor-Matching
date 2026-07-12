package com.mentormatching.modules.payment.application.service;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mentormatching.modules.booking.domain.BookingStatus;
import com.mentormatching.modules.payment.application.dto.CreatePaymentCommand;
import com.mentormatching.modules.payment.application.dto.CheckoutSessionResult;
import com.mentormatching.modules.payment.application.dto.GetMentorPaymentsQuery;
import com.mentormatching.modules.payment.application.dto.GetMyPaymentsQuery;
import com.mentormatching.modules.payment.application.dto.HandleStripeWebhookCommand;
import com.mentormatching.modules.payment.application.dto.PaymentBookingSnapshot;
import com.mentormatching.modules.payment.application.dto.PaymentDetail;
import com.mentormatching.modules.payment.application.dto.PaymentMentorSnapshot;
import com.mentormatching.modules.payment.application.dto.PaymentResult;
import com.mentormatching.modules.payment.application.port.in.CreatePaymentUseCase;
import com.mentormatching.modules.payment.application.port.in.GetPaymentDetailUseCase;
import com.mentormatching.modules.payment.application.port.in.GetMentorPaymentsUseCase;
import com.mentormatching.modules.payment.application.port.in.GetMyPaymentsUseCase;
import com.mentormatching.modules.payment.application.port.in.HandleStripeWebhookUseCase;
import com.mentormatching.modules.payment.application.port.out.BookingConfirmationPort;
import com.mentormatching.modules.payment.application.port.out.PaymentBookingLookupPort;
import com.mentormatching.modules.payment.application.port.out.PaymentCheckoutPort;
import com.mentormatching.modules.payment.application.port.out.PaymentMentorLookupPort;
import com.mentormatching.modules.payment.application.port.out.PaymentRepositoryPort;
import com.mentormatching.modules.payment.domain.Payment;
import com.mentormatching.modules.payment.domain.PaymentMethod;
import com.mentormatching.modules.payment.domain.PaymentProvider;
import com.mentormatching.modules.payment.domain.PaymentStatus;
import com.mentormatching.shared.exception.InvalidDataException;
import com.mentormatching.shared.exception.ResourceNotFoundException;
import com.mentormatching.shared.response.PageResponse;

@Service
public class PaymentService implements CreatePaymentUseCase, HandleStripeWebhookUseCase, GetPaymentDetailUseCase,
        GetMyPaymentsUseCase, GetMentorPaymentsUseCase {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepositoryPort paymentRepositoryPort;
    private final PaymentBookingLookupPort paymentBookingLookupPort;
    private final PaymentCheckoutPort paymentCheckoutPort;
    private final PaymentMentorLookupPort paymentMentorLookupPort;
    private final BookingConfirmationPort bookingConfirmationPort;

    public PaymentService(PaymentRepositoryPort paymentRepositoryPort,
                          PaymentBookingLookupPort paymentBookingLookupPort,
                          PaymentCheckoutPort paymentCheckoutPort,
                          PaymentMentorLookupPort paymentMentorLookupPort,
                          BookingConfirmationPort bookingConfirmationPort) {
        this.paymentRepositoryPort = paymentRepositoryPort;
        this.paymentBookingLookupPort = paymentBookingLookupPort;
        this.paymentCheckoutPort = paymentCheckoutPort;
        this.paymentMentorLookupPort = paymentMentorLookupPort;
        this.bookingConfirmationPort = bookingConfirmationPort;
    }

    @Override
    @Transactional
    public PaymentResult createPayment(CreatePaymentCommand command) {
        log.info("event=PAYMENT_CREATE_REQUESTED bookingId={} payerUserId={}", command.bookingId(),
                command.payerUserId());

        PaymentBookingSnapshot booking = paymentBookingLookupPort.getBookingSnapshot(command.bookingId());
        validateBookingCanBePaid(command, booking);

        return paymentRepositoryPort.findByBookingId(command.bookingId())
                .map(this::reuseExistingPayment)
                .orElseGet(() -> createPendingPayment(command, booking));
    }

    @Override
    @Transactional
    public void handleWebhookStripe(HandleStripeWebhookCommand command) {
        log.info("event=STRIPE_WEBHOOK_RECEIVED stripeEventId={} stripeEventType={} providerReferenceId={} providerTransactionId={}",
                command.eventId(), command.eventType(), command.providerReferenceId(),
                command.providerTransactionId());

        if (HandleStripeWebhookCommand.CHECKOUT_SESSION_COMPLETED.equals(command.eventType())) {
            handleCheckoutSessionCompleted(command);
            return;
        }

        log.info("event=STRIPE_WEBHOOK_IGNORED stripeEventId={} stripeEventType={}", command.eventId(),
                command.eventType());
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentDetail getPaymentDetail(Long payerUserId, Long paymentId) {
        Payment payment = paymentRepositoryPort.findById(paymentId).orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        if (!payment.getPayerUserId().equals(payerUserId)) {
            throw new ResourceNotFoundException("Payment not found");
        }

        PaymentBookingSnapshot booking = paymentBookingLookupPort.getBookingSnapshot(payment.getBookingId());
        return new PaymentDetail(payment.getId(), payment.getBookingId(), payment.getAmount(), payment.getStatus(),
                booking.status(), payment.getProviderReferenceId(), payment.getProviderTransactionId(),
                payment.getPaidAt(), payment.getExpiresAt(), payment.getFailureReason(), payment.getCreatedAt(),
                payment.getUpdatedAt());
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<Payment> getMyPayments(GetMyPaymentsQuery query) {
        return paymentRepositoryPort.findMyPayments(query);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<Payment> getMentorPayments(GetMentorPaymentsQuery query) {
        PaymentMentorSnapshot mentor = paymentMentorLookupPort.getMentorSnapshotByUserId(query.mentorUserId());
        return paymentRepositoryPort.findMentorPayments(mentor.mentorId(), query);
    }

    private void validateBookingCanBePaid(CreatePaymentCommand command, PaymentBookingSnapshot booking) {
        if (!booking.studentUserId().equals(command.payerUserId())) {
            log.warn("event=PAYMENT_CREATE_REJECTED reason=BOOKING_OWNER_MISMATCH bookingId={} payerUserId={} bookingStudentUserId={}",
                    command.bookingId(), command.payerUserId(), booking.studentUserId());
            throw new InvalidDataException("Booking does not belong to payer");
        }
        if (booking.status() != BookingStatus.PENDING) {
            log.warn("event=PAYMENT_CREATE_REJECTED reason=BOOKING_STATUS_INVALID bookingId={} payerUserId={} bookingStatus={}",
                    command.bookingId(), command.payerUserId(), booking.status());
            throw new InvalidDataException("Only pending booking can be paid");
        }
    }

    private PaymentResult reuseExistingPayment(Payment payment) {
        if (payment.getStatus() == PaymentStatus.PENDING) {
            log.info("event=PAYMENT_REUSED paymentId={} bookingId={} payerUserId={} status={}",
                    payment.getId(), payment.getBookingId(), payment.getPayerUserId(), payment.getStatus());
            return PaymentResult.from(ensureCheckoutSession(payment));
        }
        if (payment.getStatus() == PaymentStatus.PAID) {
            log.warn("event=PAYMENT_CREATE_REJECTED reason=PAYMENT_ALREADY_PAID paymentId={} bookingId={} payerUserId={}",
                    payment.getId(), payment.getBookingId(), payment.getPayerUserId());
            throw new InvalidDataException("Booking is already paid");
        }
        log.warn("event=PAYMENT_CREATE_REJECTED reason=PAYMENT_NOT_REUSABLE paymentId={} bookingId={} payerUserId={} status={}",
                payment.getId(), payment.getBookingId(), payment.getPayerUserId(), payment.getStatus());
        throw new InvalidDataException("Payment cannot be reused for this booking");
    }

    private void handleCheckoutSessionCompleted(HandleStripeWebhookCommand command) {
        validateCheckoutCompletedCommand(command);

        Payment payment = paymentRepositoryPort.findByProviderReferenceId(command.providerReferenceId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        payment.markPaid(command.providerTransactionId());
        Payment savedPayment = paymentRepositoryPort.save(payment);

        //Booking status change to confirmed
        bookingConfirmationPort.confirmBooking(savedPayment.getBookingId());

        log.info("event=PAYMENT_MARKED_PAID paymentId={} bookingId={} providerReferenceId={} providerTransactionId={} status={}",
                savedPayment.getId(), savedPayment.getBookingId(), savedPayment.getProviderReferenceId(),
                savedPayment.getProviderTransactionId(), savedPayment.getStatus());
    }

    private void validateCheckoutCompletedCommand(HandleStripeWebhookCommand command) {
        if (command.providerReferenceId() == null || command.providerReferenceId().isBlank()) {
            throw new InvalidDataException("Stripe checkout session id is required");
        }
        if (command.providerTransactionId() == null || command.providerTransactionId().isBlank()) {
            throw new InvalidDataException("Stripe payment intent id is required");
        }
    }

    private PaymentResult createPendingPayment(CreatePaymentCommand command, PaymentBookingSnapshot booking) {
        Payment payment = Payment.createPending(command.bookingId(), command.payerUserId(), booking.totalAmount(),
                PaymentMethod.GATEWAY, PaymentProvider.STRIPE);
        Payment savedPayment = paymentRepositoryPort.save(payment);
        log.info("event=PAYMENT_CREATED paymentId={} bookingId={} payerUserId={} amount={} status={}",
                savedPayment.getId(), savedPayment.getBookingId(), savedPayment.getPayerUserId(),
                savedPayment.getAmount(), savedPayment.getStatus());
        return PaymentResult.from(ensureCheckoutSession(savedPayment));
    }

    private Payment ensureCheckoutSession(Payment payment) {
        if (hasReusableCheckoutSession(payment)) {
            return payment;
        }

        CheckoutSessionResult checkoutSession = paymentCheckoutPort.createCheckoutSession(payment);
        payment.attachCheckout(checkoutSession.providerReferenceId(), checkoutSession.checkoutUrl(),
                checkoutSession.expiresAt());

        Payment savedPayment = paymentRepositoryPort.save(payment);
        log.info("event=PAYMENT_CHECKOUT_ATTACHED paymentId={} bookingId={} providerReferenceId={} expiresAt={}",
                savedPayment.getId(), savedPayment.getBookingId(), savedPayment.getProviderReferenceId(),
                savedPayment.getExpiresAt());
        return savedPayment;
    }

    private boolean hasReusableCheckoutSession(Payment payment) {
        return payment.getCheckoutUrl() != null
                && !payment.getCheckoutUrl().isBlank()
                && payment.getExpiresAt() != null
                && payment.getExpiresAt().isAfter(LocalDateTime.now());
    }
}
