package com.mentormatching.modules.catalog.application.port.out;

import java.util.List;
import java.util.Optional;

import com.mentormatching.modules.catalog.domain.Grade;
import com.mentormatching.modules.catalog.domain.GradeLevelGroup;

public interface GradeRepositoryPort {

    Grade save(Grade grade);

    Optional<Grade> findById(Long id);

    List<Grade> findByLevelGroup(GradeLevelGroup levelGroup);

    List<Grade> findAll();

    boolean existsByNameIgnoreCase(String name);

    void deleteById(Long id);
}
