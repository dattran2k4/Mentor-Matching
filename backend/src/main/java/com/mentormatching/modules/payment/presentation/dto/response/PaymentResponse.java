package com.mentormatching.modules.payment.presentation.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.mentormatching.modules.payment.domain.Payment;
import com.mentormatching.modules.payment.domain.PaymentStatus;
import com.mentormatching.shared.response.PageResponse;

public record PaymentResponse(Long id, Long bookingId, BigDecimal amount, PaymentStatus status,
                              LocalDateTime paidAt, LocalDateTime createdAt) {

    public static PaymentResponse from(Payment payment) {
        return new PaymentResponse(payment.getId(), payment.getBookingId(), payment.getAmount(), payment.getStatus(),
                payment.getPaidAt(), payment.getCreatedAt());
    }

    public static PageResponse<PaymentResponse> from(PageResponse<Payment> payments) {
        return PageResponse.<PaymentResponse>builder()
                .page(payments.getPage())
                .pageSize(payments.getPageSize())
                .totalPages(payments.getTotalPages())
                .totalItems(payments.getTotalItems())
                .data(payments.getData().stream().map(PaymentResponse::from).toList())
                .build();
    }
}
