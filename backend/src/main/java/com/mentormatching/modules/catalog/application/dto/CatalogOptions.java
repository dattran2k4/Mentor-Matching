package com.mentormatching.modules.catalog.application.dto;

import java.util.List;

public record CatalogOptions(
        List<CategoryOption> categories,
        List<SubjectOption> subjects,
        List<GradeOption> grades,
        List<SubjectGradeOption> subjectGrades
) {
    public record CategoryOption(Long id, String name, String description) {}
    public record SubjectOption(Long id, Long categoryId, String name, String description) {}
    public record GradeOption(Long id, String name, String levelGroup) {}
    public record SubjectGradeOption(Long id, Long subjectId, Long gradeId) {}
}
