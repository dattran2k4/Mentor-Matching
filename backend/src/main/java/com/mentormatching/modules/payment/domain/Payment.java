package com.mentormatching.modules.payment.domain;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.mentormatching.shared.exception.InvalidDataException;

public class Payment {

    private final Long id;
    private final Long bookingId;
    private final Long payerUserId;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private PaymentProvider paymentProvider;
    private PaymentStatus status;
    private LocalDateTime paidAt;
    private String providerReferenceId;
    private String providerTransactionId;
    private String checkoutUrl;
    private LocalDateTime expiresAt;
    private String failureReason;
    private final LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Payment(PaymentRestoreData data) {
        this.id = data.id();
        this.bookingId = data.bookingId();
        this.payerUserId = data.payerUserId();
        this.amount = data.amount();
        this.paymentMethod = data.paymentMethod();
        this.paymentProvider = data.paymentProvider();
        this.status = data.status();
        this.paidAt = data.paidAt();
        this.providerReferenceId = data.providerReferenceId();
        this.providerTransactionId = data.providerTransactionId();
        this.checkoutUrl = data.checkoutUrl();
        this.expiresAt = data.expiresAt();
        this.failureReason = data.failureReason();
        this.createdAt = data.createdAt();
        this.updatedAt = data.updatedAt();
    }

    public static Payment createPending(Long bookingId, Long payerUserId, BigDecimal amount,
                                        PaymentMethod paymentMethod, PaymentProvider paymentProvider) {
        requireNotNull(bookingId, "Booking id is required");
        requireNotNull(payerUserId, "Payer user id is required");
        validateAmount(amount);
        requireNotNull(paymentMethod, "Payment method is required");
        requireNotNull(paymentProvider, "Payment provider is required");

        LocalDateTime now = LocalDateTime.now();
        return new Payment(new PaymentRestoreData(null, bookingId, payerUserId, amount, paymentMethod,
                paymentProvider, PaymentStatus.PENDING, null, null, null, null, null, null, now, now));
    }

    public static Payment restore(PaymentRestoreData data) {
        return new Payment(data);
    }

    public void attachCheckout(String providerReferenceId, String checkoutUrl, LocalDateTime expiresAt) {
        ensurePending("Only pending payment can attach checkout data");
        this.providerReferenceId = requireNotBlank(providerReferenceId, "Provider reference id is required");
        this.checkoutUrl = requireNotBlank(checkoutUrl, "Checkout url is required");
        this.expiresAt = requireNotNull(expiresAt, "Checkout expiration is required");
        this.failureReason = null;
        touch();
    }

    public void markPaid(String providerTransactionId) {
        if (status == PaymentStatus.PAID) {
            return;
        }
        ensurePending("Only pending payment can be marked as paid");
        this.providerTransactionId = requireNotBlank(providerTransactionId, "Provider transaction id is required");
        this.status = PaymentStatus.PAID;
        this.paidAt = LocalDateTime.now();
        this.failureReason = null;
        touch();
    }

    public void markFailed(String failureReason) {
        ensurePending("Only pending payment can be marked as failed");
        this.status = PaymentStatus.FAILED;
        this.failureReason = requireNotBlank(failureReason, "Failure reason is required");
        touch();
    }

    public void cancel(String reason) {
        ensurePending("Only pending payment can be cancelled");
        this.status = PaymentStatus.CANCELLED;
        this.failureReason = reason;
        touch();
    }

    public void refund() {
        if (status != PaymentStatus.PAID) {
            throw new InvalidDataException("Only paid payment can be refunded");
        }
        this.status = PaymentStatus.REFUNDED;
        touch();
    }

    public boolean isPending() {
        return status == PaymentStatus.PENDING;
    }

    public boolean isPaid() {
        return status == PaymentStatus.PAID;
    }

    public Long getId() {
        return id;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public Long getPayerUserId() {
        return payerUserId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public PaymentProvider getPaymentProvider() {
        return paymentProvider;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public LocalDateTime getPaidAt() {
        return paidAt;
    }

    public String getProviderReferenceId() {
        return providerReferenceId;
    }

    public String getProviderTransactionId() {
        return providerTransactionId;
    }

    public String getCheckoutUrl() {
        return checkoutUrl;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public String getFailureReason() {
        return failureReason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    private void ensurePending(String message) {
        if (status != PaymentStatus.PENDING) {
            throw new InvalidDataException(message);
        }
    }

    private void touch() {
        updatedAt = LocalDateTime.now();
    }

    private static void validateAmount(BigDecimal amount) {
        requireNotNull(amount, "Payment amount is required");
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidDataException("Payment amount must be positive");
        }
    }

    private static <T> T requireNotNull(T value, String message) {
        if (value == null) {
            throw new InvalidDataException(message);
        }
        return value;
    }

    private static String requireNotBlank(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new InvalidDataException(message);
        }
        return value;
    }
}
