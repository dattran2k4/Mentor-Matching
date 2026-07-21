package com.mentormatching.modules.stats.application.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record AdminStatsOverview(LocalDate from, LocalDate to, long newUsersCount, long newMentorsCount,
                                 long totalBookings, long completedBookings, double completionRate,
                                 BigDecimal totalRevenue) {
}
