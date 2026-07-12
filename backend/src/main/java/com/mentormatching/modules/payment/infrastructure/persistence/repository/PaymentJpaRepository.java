package com.mentormatching.modules.payment.infrastructure.persistence.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mentormatching.modules.payment.domain.PaymentStatus;
import com.mentormatching.modules.payment.infrastructure.persistence.entity.PaymentJpaEntity;

public interface PaymentJpaRepository extends JpaRepository<PaymentJpaEntity, Long> {

    Optional<PaymentJpaEntity> findByBookingId(Long bookingId);

    Optional<PaymentJpaEntity> findByProviderReferenceId(String providerReferenceId);

    Page<PaymentJpaEntity> findByPayerUserId(Long payerUserId, Pageable pageable);

    Page<PaymentJpaEntity> findByPayerUserIdAndStatus(Long payerUserId, PaymentStatus status, Pageable pageable);

    @Query("""
            select p
            from PaymentJpaEntity p
            join p.booking b
            where b.mentorId = :mentorId
              and (:status is null or p.status = :status)
            """)
    Page<PaymentJpaEntity> findMentorPayments(@Param("mentorId") Long mentorId,
                                              @Param("status") PaymentStatus status,
                                              Pageable pageable);

    List<PaymentJpaEntity> findByPayerUserId(Long payerUserId);

    List<PaymentJpaEntity> findByStatus(PaymentStatus status);
}
