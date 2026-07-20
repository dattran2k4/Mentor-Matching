package com.mentormatching.modules.stats.application.port.out;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.mentormatching.modules.stats.application.dto.PaidPaymentRow;

public interface AdminStatsRepositoryPort {

    long countNewUsers(LocalDateTime from, LocalDateTime to);

    long countNewMentors(LocalDateTime from, LocalDateTime to);

    long countBookings(LocalDateTime from, LocalDateTime to);

    long countCompletedBookings(LocalDateTime from, LocalDateTime to);

    BigDecimal sumRevenue(LocalDateTime from, LocalDateTime to);

    List<LocalDateTime> findBookingCreatedTimestamps(LocalDateTime from, LocalDateTime to);

    List<PaidPaymentRow> findPaidPayments(LocalDateTime from, LocalDateTime to);
}
