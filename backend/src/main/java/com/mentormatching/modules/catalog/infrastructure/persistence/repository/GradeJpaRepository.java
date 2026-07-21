package com.mentormatching.modules.catalog.infrastructure.persistence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mentormatching.modules.catalog.domain.GradeLevelGroup;
import com.mentormatching.modules.catalog.infrastructure.persistence.entity.GradeJpaEntity;

public interface GradeJpaRepository extends JpaRepository<GradeJpaEntity, Long> {

    List<GradeJpaEntity> findByLevelGroup(GradeLevelGroup levelGroup);

    boolean existsByNameIgnoreCase(String name);
}
