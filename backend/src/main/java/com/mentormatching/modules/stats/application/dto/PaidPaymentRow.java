package com.mentormatching.modules.stats.application.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaidPaymentRow(LocalDateTime paidAt, BigDecimal amount) {
}
