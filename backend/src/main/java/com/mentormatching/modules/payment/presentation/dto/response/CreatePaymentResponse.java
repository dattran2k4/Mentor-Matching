package com.mentormatching.modules.payment.presentation.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.mentormatching.modules.payment.application.dto.PaymentResult;
import com.mentormatching.modules.payment.domain.PaymentMethod;
import com.mentormatching.modules.payment.domain.PaymentProvider;
import com.mentormatching.modules.payment.domain.PaymentStatus;

public record CreatePaymentResponse(Long id, Long bookingId, Long payerUserId, BigDecimal amount,
                                    PaymentMethod paymentMethod, PaymentProvider paymentProvider,
                                    PaymentStatus status, String checkoutUrl, LocalDateTime expiresAt) {

    public static CreatePaymentResponse from(PaymentResult result) {
        return new CreatePaymentResponse(result.id(), result.bookingId(), result.payerUserId(), result.amount(),
                result.paymentMethod(), result.paymentProvider(), result.status(), result.checkoutUrl(),
                result.expiresAt());
    }
}
