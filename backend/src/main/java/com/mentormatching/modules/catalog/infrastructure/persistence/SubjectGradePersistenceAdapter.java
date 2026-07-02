package com.mentormatching.modules.catalog.infrastructure.persistence;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.mentormatching.modules.catalog.application.port.out.SubjectGradeRepositoryPort;
import com.mentormatching.modules.catalog.domain.SubjectGrade;
import com.mentormatching.modules.catalog.infrastructure.persistence.mapper.SubjectGradePersistenceMapper;
import com.mentormatching.modules.catalog.infrastructure.persistence.repository.SubjectGradeJpaRepository;

@Component
public class SubjectGradePersistenceAdapter implements SubjectGradeRepositoryPort {

    private final SubjectGradeJpaRepository subjectGradeJpaRepository;
    private final SubjectGradePersistenceMapper subjectGradePersistenceMapper;

    public SubjectGradePersistenceAdapter(SubjectGradeJpaRepository subjectGradeJpaRepository,
                                          SubjectGradePersistenceMapper subjectGradePersistenceMapper) {
        this.subjectGradeJpaRepository = subjectGradeJpaRepository;
        this.subjectGradePersistenceMapper = subjectGradePersistenceMapper;
    }

    @Override
    public SubjectGrade save(SubjectGrade subjectGrade) {
        return subjectGradePersistenceMapper.toDomain(subjectGradeJpaRepository.save(subjectGradePersistenceMapper.toEntity(subjectGrade)));
    }

    @Override
    public List<SubjectGrade> findAll() {
        return subjectGradeJpaRepository.findAll().stream().map(subjectGradePersistenceMapper::toDomain).toList();
    }

    @Override
    public Optional<SubjectGrade> findById(Long id) {
        return subjectGradeJpaRepository.findById(id).map(subjectGradePersistenceMapper::toDomain);
    }

    @Override
    public List<SubjectGrade> findBySubjectId(Long subjectId) {
        return subjectGradeJpaRepository.findBySubjectId(subjectId).stream().map(subjectGradePersistenceMapper::toDomain).toList();
    }

    @Override
    public List<SubjectGrade> findByGradeId(Long gradeId) {
        return subjectGradeJpaRepository.findByGradeId(gradeId).stream().map(subjectGradePersistenceMapper::toDomain).toList();
    }
}
