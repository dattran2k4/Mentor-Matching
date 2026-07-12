package com.mentormatching.modules.catalog.application.service;

import org.springframework.stereotype.Service;

import com.mentormatching.modules.catalog.application.dto.CatalogOptions;
import com.mentormatching.modules.catalog.application.dto.SubjectGradeSummary;
import com.mentormatching.modules.catalog.application.port.in.GetCatalogOptionsUseCase;
import com.mentormatching.modules.catalog.application.port.in.GetSubjectGradeIdsUseCase;
import com.mentormatching.modules.catalog.application.port.in.GetSubjectGradeSummaryUseCase;
import com.mentormatching.modules.catalog.application.port.out.CategoryRepositoryPort;
import com.mentormatching.modules.catalog.application.port.out.GradeRepositoryPort;
import com.mentormatching.modules.catalog.application.port.out.SubjectGradeRepositoryPort;
import com.mentormatching.modules.catalog.application.port.out.SubjectRepositoryPort;
import com.mentormatching.modules.catalog.domain.Subject;
import com.mentormatching.modules.catalog.domain.SubjectGrade;
import com.mentormatching.shared.exception.ResourceNotFoundException;

import java.util.List;
import java.util.stream.Stream;

@Service
public class CatalogQueryService implements GetSubjectGradeSummaryUseCase, GetCatalogOptionsUseCase, GetSubjectGradeIdsUseCase {

    private final SubjectGradeRepositoryPort subjectGradeRepositoryPort;
    private final SubjectRepositoryPort subjectRepositoryPort;
    private final GradeRepositoryPort gradeRepositoryPort;
    private final CategoryRepositoryPort categoryRepositoryPort;

    public CatalogQueryService(SubjectGradeRepositoryPort subjectGradeRepositoryPort,
                               SubjectRepositoryPort subjectRepositoryPort,
                               GradeRepositoryPort gradeRepositoryPort,
                               CategoryRepositoryPort categoryRepositoryPort) {
        this.subjectGradeRepositoryPort = subjectGradeRepositoryPort;
        this.subjectRepositoryPort = subjectRepositoryPort;
        this.gradeRepositoryPort = gradeRepositoryPort;
        this.categoryRepositoryPort = categoryRepositoryPort;
    }

    @Override
    public SubjectGradeSummary getSubjectGradeSummary(Long subjectGradeId) {
        SubjectGrade subjectGrade = subjectGradeRepositoryPort.findById(subjectGradeId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject grade not found"));
        Subject subject = subjectRepositoryPort.findById(subjectGrade.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
        Long gradeId = subjectGrade.getGradeId();
        String gradeName = gradeId == null ? null : gradeRepositoryPort.findById(gradeId)
                .map(grade -> grade.getName()).orElse(null);
        return new SubjectGradeSummary(subjectGrade.getId(), subject.getId(), subject.getName(), gradeId, gradeName);
    }

    @Override
    public CatalogOptions getCatalogOptions() {
        List<CatalogOptions.CategoryOption> categories = categoryRepositoryPort.findAll().stream()
                .map(c -> new CatalogOptions.CategoryOption(c.getId(), c.getName(), c.getDescription()))
                .toList();

        List<CatalogOptions.SubjectOption> subjects = subjectRepositoryPort.findAll().stream()
                .map(s -> new CatalogOptions.SubjectOption(s.getId(), s.getCategoryId(), s.getName(), s.getDescription()))
                .toList();

        List<CatalogOptions.GradeOption> grades = gradeRepositoryPort.findAll().stream()
                .map(g -> new CatalogOptions.GradeOption(g.getId(), g.getName(), g.getLevelGroup().name()))
                .toList();

        List<CatalogOptions.SubjectGradeOption> subjectGrades = subjectGradeRepositoryPort.findAll().stream()
                .map(sg -> new CatalogOptions.SubjectGradeOption(sg.getId(), sg.getSubjectId(), sg.getGradeId()))
                .toList();

        return new CatalogOptions(categories, subjects, grades, subjectGrades);
    }

    @Override
    public List<Long> getSubjectGradeIds(Long subjectId, Long gradeId) {
        if (subjectId != null) {
            Stream<SubjectGrade> stream = subjectGradeRepositoryPort.findBySubjectId(subjectId).stream();
            if (gradeId != null) {
                stream = stream.filter(sg -> gradeId.equals(sg.getGradeId()));
            }
            return stream.map(SubjectGrade::getId).toList();
        } else if (gradeId != null) {
            return subjectGradeRepositoryPort.findByGradeId(gradeId).stream()
                    .map(SubjectGrade::getId).toList();
        }
        return List.of();
    }
}
