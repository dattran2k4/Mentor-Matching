package com.mentormatching.modules.stats.application.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.mentormatching.modules.stats.application.dto.AdminStatsDailyPoint;
import com.mentormatching.modules.stats.application.dto.AdminStatsOverview;
import com.mentormatching.modules.stats.application.dto.GetAdminStatsQuery;
import com.mentormatching.modules.stats.application.dto.PaidPaymentRow;
import com.mentormatching.modules.stats.application.port.out.AdminStatsRepositoryPort;
import com.mentormatching.shared.exception.InvalidDataException;

class AdminStatsQueryServiceTest {

    private AdminStatsRepositoryPort adminStatsRepositoryPort;
    private AdminStatsQueryService adminStatsQueryService;

    @BeforeEach
    void setUp() {
        adminStatsRepositoryPort = mock(AdminStatsRepositoryPort.class);
        adminStatsQueryService = new AdminStatsQueryService(adminStatsRepositoryPort);
    }

    @Test
    void getOverviewComputesCompletionRateAndUsesGivenRange() {
        LocalDate from = LocalDate.of(2026, 6, 1);
        LocalDate to = LocalDate.of(2026, 6, 10);
        LocalDateTime fromDateTime = from.atStartOfDay();
        LocalDateTime toDateTime = LocalDateTime.of(to, LocalTime.MAX);

        when(adminStatsRepositoryPort.countNewUsers(fromDateTime, toDateTime)).thenReturn(12L);
        when(adminStatsRepositoryPort.countNewMentors(fromDateTime, toDateTime)).thenReturn(3L);
        when(adminStatsRepositoryPort.countBookings(fromDateTime, toDateTime)).thenReturn(20L);
        when(adminStatsRepositoryPort.countCompletedBookings(fromDateTime, toDateTime)).thenReturn(5L);
        when(adminStatsRepositoryPort.sumRevenue(fromDateTime, toDateTime)).thenReturn(new BigDecimal("1000000"));

        AdminStatsOverview overview = adminStatsQueryService.getOverview(new GetAdminStatsQuery(from, to));

        assertEquals(from, overview.from());
        assertEquals(to, overview.to());
        assertEquals(12L, overview.newUsersCount());
        assertEquals(3L, overview.newMentorsCount());
        assertEquals(20L, overview.totalBookings());
        assertEquals(5L, overview.completedBookings());
        assertEquals(0.25, overview.completionRate());
        assertEquals(new BigDecimal("1000000"), overview.totalRevenue());
    }

    @Test
    void getOverviewReturnsZeroCompletionRateWhenNoBookings() {
        LocalDate to = LocalDate.now();
        LocalDate from = to.minusDays(29);

        when(adminStatsRepositoryPort.countBookings(from.atStartOfDay(), LocalDateTime.of(to, LocalTime.MAX)))
                .thenReturn(0L);
        when(adminStatsRepositoryPort.countCompletedBookings(from.atStartOfDay(),
                LocalDateTime.of(to, LocalTime.MAX))).thenReturn(0L);
        when(adminStatsRepositoryPort.sumRevenue(from.atStartOfDay(), LocalDateTime.of(to, LocalTime.MAX)))
                .thenReturn(BigDecimal.ZERO);

        AdminStatsOverview overview = adminStatsQueryService.getOverview(new GetAdminStatsQuery(null, null));

        assertEquals(0.0, overview.completionRate());
        assertEquals(from, overview.from());
        assertEquals(to, overview.to());
    }

    @Test
    void getOverviewThrowsWhenFromIsAfterTo() {
        GetAdminStatsQuery query = new GetAdminStatsQuery(LocalDate.of(2026, 6, 10), LocalDate.of(2026, 6, 1));

        InvalidDataException exception = assertThrows(InvalidDataException.class,
                () -> adminStatsQueryService.getOverview(query));

        assertEquals("From date must not be after to date", exception.getMessage());
    }

    @Test
    void getTimeseriesGroupsBookingsAndRevenueByDay() {
        LocalDate from = LocalDate.of(2026, 6, 1);
        LocalDate to = LocalDate.of(2026, 6, 2);
        LocalDateTime fromDateTime = from.atStartOfDay();
        LocalDateTime toDateTime = LocalDateTime.of(to, LocalTime.MAX);

        when(adminStatsRepositoryPort.findBookingCreatedTimestamps(fromDateTime, toDateTime)).thenReturn(List.of(
                LocalDateTime.of(2026, 6, 1, 9, 0),
                LocalDateTime.of(2026, 6, 1, 14, 0),
                LocalDateTime.of(2026, 6, 2, 10, 0)));
        when(adminStatsRepositoryPort.findPaidPayments(fromDateTime, toDateTime)).thenReturn(List.of(
                new PaidPaymentRow(LocalDateTime.of(2026, 6, 1, 10, 0), new BigDecimal("100000")),
                new PaidPaymentRow(LocalDateTime.of(2026, 6, 1, 15, 0), new BigDecimal("200000"))));

        List<AdminStatsDailyPoint> timeseries = adminStatsQueryService.getTimeseries(
                new GetAdminStatsQuery(from, to));

        assertEquals(2, timeseries.size());
        assertEquals(from, timeseries.get(0).date());
        assertEquals(2L, timeseries.get(0).bookingsCount());
        assertEquals(new BigDecimal("300000"), timeseries.get(0).revenue());
        assertEquals(to, timeseries.get(1).date());
        assertEquals(1L, timeseries.get(1).bookingsCount());
        assertEquals(BigDecimal.ZERO, timeseries.get(1).revenue());
    }
}
