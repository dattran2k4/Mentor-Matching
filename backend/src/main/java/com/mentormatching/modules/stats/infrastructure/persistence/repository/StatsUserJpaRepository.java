package com.mentormatching.modules.stats.infrastructure.persistence.repository;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mentormatching.modules.user.infrastructure.persistence.entity.UserJpaEntity;

public interface StatsUserJpaRepository extends JpaRepository<UserJpaEntity, Long> {

    long countByCreatedAtBetween(LocalDateTime from, LocalDateTime to);
}
