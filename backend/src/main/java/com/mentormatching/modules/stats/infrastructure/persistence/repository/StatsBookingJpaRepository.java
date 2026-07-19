package com.mentormatching.modules.stats.infrastructure.persistence.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mentormatching.modules.booking.domain.BookingStatus;
import com.mentormatching.modules.booking.infrastructure.persistence.entity.BookingJpaEntity;

public interface StatsBookingJpaRepository extends JpaRepository<BookingJpaEntity, Long> {

    long countByCreatedAtBetween(LocalDateTime from, LocalDateTime to);

    long countByCreatedAtBetweenAndStatus(LocalDateTime from, LocalDateTime to, BookingStatus status);

    @Query("select b.createdAt from BookingJpaEntity b where b.createdAt between :from and :to")
    List<LocalDateTime> findCreatedAtBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
}
