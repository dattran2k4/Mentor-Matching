package com.mentormatching.modules.stats.application.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mentormatching.modules.stats.application.dto.AdminStatsDailyPoint;
import com.mentormatching.modules.stats.application.dto.AdminStatsOverview;
import com.mentormatching.modules.stats.application.dto.GetAdminStatsQuery;
import com.mentormatching.modules.stats.application.dto.PaidPaymentRow;
import com.mentormatching.modules.stats.application.port.in.GetAdminStatsOverviewUseCase;
import com.mentormatching.modules.stats.application.port.in.GetAdminStatsTimeseriesUseCase;
import com.mentormatching.modules.stats.application.port.out.AdminStatsRepositoryPort;
import com.mentormatching.shared.exception.InvalidDataException;

@Service
public class AdminStatsQueryService implements GetAdminStatsOverviewUseCase, GetAdminStatsTimeseriesUseCase {

    private static final int DEFAULT_RANGE_DAYS = 29;

    private final AdminStatsRepositoryPort adminStatsRepositoryPort;

    public AdminStatsQueryService(AdminStatsRepositoryPort adminStatsRepositoryPort) {
        this.adminStatsRepositoryPort = adminStatsRepositoryPort;
    }

    @Override
    @Transactional(readOnly = true)
    public AdminStatsOverview getOverview(GetAdminStatsQuery query) {
        DateRange range = resolveRange(query);

        long newUsersCount = adminStatsRepositoryPort.countNewUsers(range.fromDateTime(), range.toDateTime());
        long newMentorsCount = adminStatsRepositoryPort.countNewMentors(range.fromDateTime(), range.toDateTime());
        long totalBookings = adminStatsRepositoryPort.countBookings(range.fromDateTime(), range.toDateTime());
        long completedBookings = adminStatsRepositoryPort.countCompletedBookings(range.fromDateTime(),
                range.toDateTime());
        BigDecimal totalRevenue = adminStatsRepositoryPort.sumRevenue(range.fromDateTime(), range.toDateTime());
        double completionRate = totalBookings == 0 ? 0.0 : (double) completedBookings / totalBookings;

        return new AdminStatsOverview(range.from(), range.to(), newUsersCount, newMentorsCount, totalBookings,
                completedBookings, completionRate, totalRevenue);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdminStatsDailyPoint> getTimeseries(GetAdminStatsQuery query) {
        DateRange range = resolveRange(query);

        Map<LocalDate, Long> bookingsByDate = adminStatsRepositoryPort
                .findBookingCreatedTimestamps(range.fromDateTime(), range.toDateTime()).stream()
                .collect(Collectors.groupingBy(LocalDateTime::toLocalDate, Collectors.counting()));

        Map<LocalDate, BigDecimal> revenueByDate = adminStatsRepositoryPort
                .findPaidPayments(range.fromDateTime(), range.toDateTime()).stream()
                .collect(Collectors.groupingBy(row -> row.paidAt().toLocalDate(),
                        Collectors.reducing(BigDecimal.ZERO, PaidPaymentRow::amount, BigDecimal::add)));

        return range.from().datesUntil(range.to().plusDays(1))
                .map(date -> new AdminStatsDailyPoint(date, bookingsByDate.getOrDefault(date, 0L),
                        revenueByDate.getOrDefault(date, BigDecimal.ZERO)))
                .sorted(Comparator.comparing(AdminStatsDailyPoint::date))
                .toList();
    }

    private DateRange resolveRange(GetAdminStatsQuery query) {
        LocalDate to = query.to() != null ? query.to() : LocalDate.now();
        LocalDate from = query.from() != null ? query.from() : to.minusDays(DEFAULT_RANGE_DAYS);
        if (from.isAfter(to)) {
            throw new InvalidDataException("From date must not be after to date");
        }
        return new DateRange(from, to);
    }

    private record DateRange(LocalDate from, LocalDate to) {

        LocalDateTime fromDateTime() {
            return from.atStartOfDay();
        }

        LocalDateTime toDateTime() {
            return LocalDateTime.of(to, LocalTime.MAX);
        }
    }
}
