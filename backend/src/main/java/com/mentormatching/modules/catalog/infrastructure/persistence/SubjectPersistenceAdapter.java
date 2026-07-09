package com.mentormatching.modules.catalog.infrastructure.persistence;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.mentormatching.modules.catalog.application.port.out.SubjectRepositoryPort;
import com.mentormatching.modules.catalog.domain.Subject;
import com.mentormatching.modules.catalog.infrastructure.persistence.mapper.SubjectPersistenceMapper;
import com.mentormatching.modules.catalog.infrastructure.persistence.repository.SubjectJpaRepository;

@Component
public class SubjectPersistenceAdapter implements SubjectRepositoryPort {

    private final SubjectJpaRepository subjectJpaRepository;
    private final SubjectPersistenceMapper subjectPersistenceMapper;

    public SubjectPersistenceAdapter(SubjectJpaRepository subjectJpaRepository,
                                     SubjectPersistenceMapper subjectPersistenceMapper) {
        this.subjectJpaRepository = subjectJpaRepository;
        this.subjectPersistenceMapper = subjectPersistenceMapper;
    }

    @Override
    public Subject save(Subject subject) {
        return subjectPersistenceMapper.toDomain(subjectJpaRepository.save(subjectPersistenceMapper.toEntity(subject)));
    }

    @Override
    public Optional<Subject> findById(Long id) {
        return subjectJpaRepository.findById(id).map(subjectPersistenceMapper::toDomain);
    }

    @Override
    public List<Subject> findByCategoryId(Long categoryId) {
        return subjectJpaRepository.findByCategoryId(categoryId).stream().map(subjectPersistenceMapper::toDomain).toList();
    }

    @Override
    public List<Subject> findAll() {
        return subjectJpaRepository.findAll().stream().map(subjectPersistenceMapper::toDomain).toList();
    }

    @Override
    public boolean existsByName(String name) {
        return subjectJpaRepository.existsByName(name);
    }

    @Override
    public void deleteById(Long id) {
        subjectJpaRepository.deleteById(id);
    }
}
