package com.mentormatching.modules.payment.application.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.mentormatching.modules.booking.domain.BookingStatus;
import com.mentormatching.modules.payment.application.dto.GetMentorPaymentsQuery;
import com.mentormatching.modules.payment.application.dto.GetMyPaymentsQuery;
import com.mentormatching.modules.payment.application.dto.PaymentBookingSnapshot;
import com.mentormatching.modules.payment.application.dto.PaymentDetail;
import com.mentormatching.modules.payment.application.dto.PaymentMentorSnapshot;
import com.mentormatching.modules.payment.application.port.out.BookingConfirmationPort;
import com.mentormatching.modules.payment.application.port.out.PaymentBookingLookupPort;
import com.mentormatching.modules.payment.application.port.out.PaymentCheckoutPort;
import com.mentormatching.modules.payment.application.port.out.PaymentMentorLookupPort;
import com.mentormatching.modules.payment.application.port.out.PaymentRepositoryPort;
import com.mentormatching.modules.payment.domain.Payment;
import com.mentormatching.modules.payment.domain.PaymentMethod;
import com.mentormatching.modules.payment.domain.PaymentProvider;
import com.mentormatching.modules.payment.domain.PaymentRestoreData;
import com.mentormatching.modules.payment.domain.PaymentStatus;
import com.mentormatching.shared.exception.ResourceNotFoundException;
import com.mentormatching.shared.response.PageResponse;

class PaymentServiceTest {

    private PaymentRepositoryPort paymentRepositoryPort;
    private PaymentBookingLookupPort paymentBookingLookupPort;
    private PaymentCheckoutPort paymentCheckoutPort;
    private PaymentMentorLookupPort paymentMentorLookupPort;
    private BookingConfirmationPort bookingConfirmationPort;
    private PaymentService paymentService;

    @BeforeEach
    void setUp() {
        paymentRepositoryPort = mock(PaymentRepositoryPort.class);
        paymentBookingLookupPort = mock(PaymentBookingLookupPort.class);
        paymentCheckoutPort = mock(PaymentCheckoutPort.class);
        paymentMentorLookupPort = mock(PaymentMentorLookupPort.class);
        bookingConfirmationPort = mock(BookingConfirmationPort.class);
        paymentService = new PaymentService(paymentRepositoryPort, paymentBookingLookupPort, paymentCheckoutPort,
                paymentMentorLookupPort, bookingConfirmationPort);
    }

    @Test
    void getPaymentDetailReturnsOwnedPaymentDetail() {
        Payment payment = paidPayment(30L);
        PaymentBookingSnapshot booking = new PaymentBookingSnapshot(45L, 30L, new BigDecimal("300000"),
                BookingStatus.CONFIRMED);

        when(paymentRepositoryPort.findById(123L)).thenReturn(Optional.of(payment));
        when(paymentBookingLookupPort.getBookingSnapshot(45L)).thenReturn(booking);

        PaymentDetail actual = paymentService.getPaymentDetail(30L, 123L);

        assertEquals(123L, actual.id());
        assertEquals(45L, actual.bookingId());
        assertEquals(new BigDecimal("300000"), actual.amount());
        assertEquals(PaymentStatus.PAID, actual.status());
        assertEquals(BookingStatus.CONFIRMED, actual.bookingStatus());
        assertEquals("cs_test_123", actual.providerReferenceId());
        assertEquals("pi_123", actual.providerTransactionId());
        assertEquals(LocalDateTime.parse("2026-06-14T09:35:00"), actual.paidAt());
    }

    @Test
    void getPaymentDetailThrowsWhenPaymentDoesNotBelongToUser() {
        Payment payment = paidPayment(99L);

        when(paymentRepositoryPort.findById(123L)).thenReturn(Optional.of(payment));

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> paymentService.getPaymentDetail(30L, 123L));

        assertEquals("Payment not found", exception.getMessage());
    }

    @Test
    void getPaymentDetailThrowsWhenPaymentDoesNotExist() {
        when(paymentRepositoryPort.findById(123L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> paymentService.getPaymentDetail(30L, 123L));

        assertEquals("Payment not found", exception.getMessage());
    }

    @Test
    void getMyPaymentsReturnsRepositoryPage() {
        GetMyPaymentsQuery query = new GetMyPaymentsQuery(30L, 1, 10, "createdAt", "desc", PaymentStatus.PAID);
        PageResponse<Payment> expected = PageResponse.<Payment>builder()
                .page(1)
                .pageSize(10)
                .totalPages(1)
                .totalItems(1)
                .data(List.of(paidPayment(30L)))
                .build();

        when(paymentRepositoryPort.findMyPayments(query)).thenReturn(expected);

        PageResponse<Payment> actual = paymentService.getMyPayments(query);

        assertEquals(expected, actual);
    }

    @Test
    void getMentorPaymentsResolvesMentorIdBeforeQueryingRepository() {
        GetMentorPaymentsQuery query = new GetMentorPaymentsQuery(70L, 1, 10, "createdAt", "desc",
                PaymentStatus.PAID);
        PageResponse<Payment> expected = PageResponse.<Payment>builder()
                .page(1)
                .pageSize(10)
                .totalPages(1)
                .totalItems(1)
                .data(List.of(paidPayment(30L)))
                .build();

        when(paymentMentorLookupPort.getMentorSnapshotByUserId(70L)).thenReturn(new PaymentMentorSnapshot(15L));
        when(paymentRepositoryPort.findMentorPayments(15L, query)).thenReturn(expected);

        PageResponse<Payment> actual = paymentService.getMentorPayments(query);

        assertEquals(expected, actual);
    }

    private Payment paidPayment(Long payerUserId) {
        return Payment.restore(new PaymentRestoreData(123L, 45L, payerUserId, new BigDecimal("300000"),
                PaymentMethod.GATEWAY, PaymentProvider.STRIPE, PaymentStatus.PAID,
                LocalDateTime.parse("2026-06-14T09:35:00"), "cs_test_123", "pi_123",
                "https://checkout.stripe.test/session/123", LocalDateTime.parse("2026-06-14T10:00:00"), null,
                LocalDateTime.parse("2026-06-14T09:00:00"), LocalDateTime.parse("2026-06-14T09:35:00")));
    }
}
