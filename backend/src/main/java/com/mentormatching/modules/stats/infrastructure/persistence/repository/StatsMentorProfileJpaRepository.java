package com.mentormatching.modules.stats.infrastructure.persistence.repository;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mentormatching.modules.mentor.infrastructure.persistence.entity.MentorProfileJpaEntity;

public interface StatsMentorProfileJpaRepository extends JpaRepository<MentorProfileJpaEntity, Long> {

    long countByCreatedAtBetween(LocalDateTime from, LocalDateTime to);
}
