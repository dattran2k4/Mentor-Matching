package com.mentormatching.modules.payment.application.dto;

import com.mentormatching.modules.payment.domain.PaymentStatus;

public record GetMyPaymentsQuery(Long payerUserId, int page, int size, String sortBy, String sortDir,
                                 PaymentStatus status) {
}
