package com.mentormatching.modules.catalog.infrastructure.persistence;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.mentormatching.modules.catalog.application.port.out.GradeRepositoryPort;
import com.mentormatching.modules.catalog.domain.Grade;
import com.mentormatching.modules.catalog.domain.GradeLevelGroup;
import com.mentormatching.modules.catalog.infrastructure.persistence.mapper.GradePersistenceMapper;
import com.mentormatching.modules.catalog.infrastructure.persistence.repository.GradeJpaRepository;

@Component
public class GradePersistenceAdapter implements GradeRepositoryPort {

    private final GradeJpaRepository gradeJpaRepository;
    private final GradePersistenceMapper gradePersistenceMapper;

    public GradePersistenceAdapter(GradeJpaRepository gradeJpaRepository,
                                   GradePersistenceMapper gradePersistenceMapper) {
        this.gradeJpaRepository = gradeJpaRepository;
        this.gradePersistenceMapper = gradePersistenceMapper;
    }

    @Override
    public Grade save(Grade grade) {
        return gradePersistenceMapper.toDomain(gradeJpaRepository.save(gradePersistenceMapper.toEntity(grade)));
    }

    @Override
    public Optional<Grade> findById(Long id) {
        return gradeJpaRepository.findById(id).map(gradePersistenceMapper::toDomain);
    }

    @Override
    public List<Grade> findByLevelGroup(GradeLevelGroup levelGroup) {
        return gradeJpaRepository.findByLevelGroup(levelGroup).stream().map(gradePersistenceMapper::toDomain).toList();
    }

    @Override
    public List<Grade> findAll() {
        return gradeJpaRepository.findAll().stream().map(gradePersistenceMapper::toDomain).toList();
    }

    @Override
    public boolean existsByNameIgnoreCase(String name) {
        return gradeJpaRepository.existsByNameIgnoreCase(name);
    }

    @Override
    public void deleteById(Long id) {
        gradeJpaRepository.deleteById(id);
    }
}
