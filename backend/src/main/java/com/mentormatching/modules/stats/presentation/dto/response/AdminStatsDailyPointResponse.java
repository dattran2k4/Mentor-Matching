package com.mentormatching.modules.stats.presentation.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.mentormatching.modules.stats.application.dto.AdminStatsDailyPoint;

public record AdminStatsDailyPointResponse(LocalDate date, long bookingsCount, BigDecimal revenue) {

    public static AdminStatsDailyPointResponse from(AdminStatsDailyPoint point) {
        return new AdminStatsDailyPointResponse(point.date(), point.bookingsCount(), point.revenue());
    }

    public static List<AdminStatsDailyPointResponse> from(List<AdminStatsDailyPoint> points) {
        return points.stream().map(AdminStatsDailyPointResponse::from).toList();
    }
}
