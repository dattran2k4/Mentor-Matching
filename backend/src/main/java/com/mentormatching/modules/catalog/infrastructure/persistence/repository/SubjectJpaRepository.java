package com.mentormatching.modules.catalog.infrastructure.persistence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mentormatching.modules.catalog.infrastructure.persistence.entity.SubjectJpaEntity;

public interface SubjectJpaRepository extends JpaRepository<SubjectJpaEntity, Long> {

    List<SubjectJpaEntity> findByCategoryId(Long categoryId);

    boolean existsByName(String name);
}
