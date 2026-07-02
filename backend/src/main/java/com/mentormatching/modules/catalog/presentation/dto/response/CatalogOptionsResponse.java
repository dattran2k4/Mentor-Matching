package com.mentormatching.modules.catalog.presentation.dto.response;

import java.util.List;

import com.mentormatching.modules.catalog.application.dto.CatalogOptions;

public record CatalogOptionsResponse(
        List<CategoryOptionResponse> categories,
        List<SubjectOptionResponse> subjects,
        List<GradeOptionResponse> grades,
        List<SubjectGradeOptionResponse> subjectGrades
) {
    public record CategoryOptionResponse(Long id, String name, String description) {}
    public record SubjectOptionResponse(Long id, Long categoryId, String name, String description) {}
    public record GradeOptionResponse(Long id, String name, String levelGroup) {}
    public record SubjectGradeOptionResponse(Long id, Long subjectId, Long gradeId) {}

    public static CatalogOptionsResponse from(CatalogOptions options) {
        return new CatalogOptionsResponse(
                options.categories().stream()
                        .map(c -> new CategoryOptionResponse(c.id(), c.name(), c.description()))
                        .toList(),
                options.subjects().stream()
                        .map(s -> new SubjectOptionResponse(s.id(), s.categoryId(), s.name(), s.description()))
                        .toList(),
                options.grades().stream()
                        .map(g -> new GradeOptionResponse(g.id(), g.name(), g.levelGroup()))
                        .toList(),
                options.subjectGrades().stream()
                        .map(sg -> new SubjectGradeOptionResponse(sg.id(), sg.subjectId(), sg.gradeId()))
                        .toList()
        );
    }
}
