package com.mentormatching.modules.catalog.application.port.out;

import java.util.List;
import java.util.Optional;

import com.mentormatching.modules.catalog.domain.SubjectGrade;

public interface SubjectGradeRepositoryPort {

    SubjectGrade save(SubjectGrade subjectGrade);

    List<SubjectGrade> findAll();

    Optional<SubjectGrade> findById(Long id);

    List<SubjectGrade> findBySubjectId(Long subjectId);

    List<SubjectGrade> findByGradeId(Long gradeId);
}
