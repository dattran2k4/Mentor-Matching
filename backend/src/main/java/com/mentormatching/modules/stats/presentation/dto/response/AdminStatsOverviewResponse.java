package com.mentormatching.modules.stats.presentation.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.mentormatching.modules.stats.application.dto.AdminStatsOverview;

public record AdminStatsOverviewResponse(LocalDate from, LocalDate to, long newUsersCount, long newMentorsCount,
                                         long totalBookings, long completedBookings, double completionRate,
                                         BigDecimal totalRevenue) {

    public static AdminStatsOverviewResponse from(AdminStatsOverview overview) {
        return new AdminStatsOverviewResponse(overview.from(), overview.to(), overview.newUsersCount(),
                overview.newMentorsCount(), overview.totalBookings(), overview.completedBookings(),
                overview.completionRate(), overview.totalRevenue());
    }
}
