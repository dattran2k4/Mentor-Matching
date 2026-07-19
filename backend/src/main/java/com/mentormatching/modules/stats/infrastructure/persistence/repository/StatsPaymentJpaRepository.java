package com.mentormatching.modules.stats.infrastructure.persistence.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mentormatching.modules.payment.domain.PaymentStatus;
import com.mentormatching.modules.payment.infrastructure.persistence.entity.PaymentJpaEntity;

public interface StatsPaymentJpaRepository extends JpaRepository<PaymentJpaEntity, Long> {

    @Query("select coalesce(sum(p.amount), 0) from PaymentJpaEntity p "
            + "where p.status = :status and p.paidAt between :from and :to")
    BigDecimal sumAmountByStatusAndPaidAtBetween(@Param("status") PaymentStatus status,
            @Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query("select p.paidAt as paidAt, p.amount as amount from PaymentJpaEntity p "
            + "where p.status = :status and p.paidAt between :from and :to")
    List<PaidPaymentProjection> findByStatusAndPaidAtBetween(@Param("status") PaymentStatus status,
            @Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    interface PaidPaymentProjection {

        LocalDateTime getPaidAt();

        BigDecimal getAmount();
    }
}
