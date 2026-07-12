package com.mentormatching.modules.catalog.application.port.out;

import java.util.List;
import java.util.Optional;

import com.mentormatching.modules.catalog.domain.Subject;

public interface SubjectRepositoryPort {

    Subject save(Subject subject);

    Optional<Subject> findById(Long id);

    List<Subject> findByCategoryId(Long categoryId);

    List<Subject> findAll();

    boolean existsByNameIgnoreCase(String name);

    void deleteById(Long id);
}
