package com.mentormatching.modules.stats.application.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record AdminStatsDailyPoint(LocalDate date, long bookingsCount, BigDecimal revenue) {
}
