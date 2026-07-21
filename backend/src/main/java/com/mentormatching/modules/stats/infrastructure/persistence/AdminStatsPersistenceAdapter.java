package com.mentormatching.modules.stats.infrastructure.persistence;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Component;

import com.mentormatching.modules.booking.domain.BookingStatus;
import com.mentormatching.modules.payment.domain.PaymentStatus;
import com.mentormatching.modules.stats.application.dto.PaidPaymentRow;
import com.mentormatching.modules.stats.application.port.out.AdminStatsRepositoryPort;
import com.mentormatching.modules.stats.infrastructure.persistence.repository.StatsBookingJpaRepository;
import com.mentormatching.modules.stats.infrastructure.persistence.repository.StatsMentorProfileJpaRepository;
import com.mentormatching.modules.stats.infrastructure.persistence.repository.StatsPaymentJpaRepository;
import com.mentormatching.modules.stats.infrastructure.persistence.repository.StatsUserJpaRepository;

@Component
public class AdminStatsPersistenceAdapter implements AdminStatsRepositoryPort {

    private final StatsUserJpaRepository statsUserJpaRepository;
    private final StatsMentorProfileJpaRepository statsMentorProfileJpaRepository;
    private final StatsBookingJpaRepository statsBookingJpaRepository;
    private final StatsPaymentJpaRepository statsPaymentJpaRepository;

    public AdminStatsPersistenceAdapter(StatsUserJpaRepository statsUserJpaRepository,
                                        StatsMentorProfileJpaRepository statsMentorProfileJpaRepository,
                                        StatsBookingJpaRepository statsBookingJpaRepository,
                                        StatsPaymentJpaRepository statsPaymentJpaRepository) {
        this.statsUserJpaRepository = statsUserJpaRepository;
        this.statsMentorProfileJpaRepository = statsMentorProfileJpaRepository;
        this.statsBookingJpaRepository = statsBookingJpaRepository;
        this.statsPaymentJpaRepository = statsPaymentJpaRepository;
    }

    @Override
    public long countNewUsers(LocalDateTime from, LocalDateTime to) {
        return statsUserJpaRepository.countByCreatedAtBetween(from, to);
    }

    @Override
    public long countNewMentors(LocalDateTime from, LocalDateTime to) {
        return statsMentorProfileJpaRepository.countByCreatedAtBetween(from, to);
    }

    @Override
    public long countBookings(LocalDateTime from, LocalDateTime to) {
        return statsBookingJpaRepository.countByCreatedAtBetween(from, to);
    }

    @Override
    public long countCompletedBookings(LocalDateTime from, LocalDateTime to) {
        return statsBookingJpaRepository.countByCreatedAtBetweenAndStatus(from, to, BookingStatus.COMPLETED);
    }

    @Override
    public BigDecimal sumRevenue(LocalDateTime from, LocalDateTime to) {
        return statsPaymentJpaRepository.sumAmountByStatusAndPaidAtBetween(PaymentStatus.PAID, from, to);
    }

    @Override
    public List<LocalDateTime> findBookingCreatedTimestamps(LocalDateTime from, LocalDateTime to) {
        return statsBookingJpaRepository.findCreatedAtBetween(from, to);
    }

    @Override
    public List<PaidPaymentRow> findPaidPayments(LocalDateTime from, LocalDateTime to) {
        return statsPaymentJpaRepository.findByStatusAndPaidAtBetween(PaymentStatus.PAID, from, to).stream()
                .map(row -> new PaidPaymentRow(row.getPaidAt(), row.getAmount()))
                .toList();
    }
}
