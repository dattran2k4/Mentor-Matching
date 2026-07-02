package com.mentormatching.modules.review.infrastructure.persistence.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mentormatching.modules.review.infrastructure.persistence.entity.ReviewJpaEntity;

public interface ReviewJpaRepository extends JpaRepository<ReviewJpaEntity, Long> {

    Optional<ReviewJpaEntity> findByBookingId(Long bookingId);

    List<ReviewJpaEntity> findByStudentUserId(Long studentUserId);

    List<ReviewJpaEntity> findByMentorId(Long mentorId);

    org.springframework.data.domain.Page<ReviewJpaEntity> findByMentorId(Long mentorId, org.springframework.data.domain.Pageable pageable);
}
