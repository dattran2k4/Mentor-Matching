package com.mentormatching.modules.catalog.presentation.admin;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mentormatching.modules.catalog.application.dto.command.CreateGradeCommand;
import com.mentormatching.modules.catalog.application.dto.command.CreateSubjectCommand;
import com.mentormatching.modules.catalog.application.dto.command.UpdateGradeCommand;
import com.mentormatching.modules.catalog.application.dto.command.UpdateSubjectCommand;
import com.mentormatching.modules.catalog.application.port.in.ManageGradeUseCase;
import com.mentormatching.modules.catalog.application.port.in.ManageSubjectUseCase;
import com.mentormatching.modules.catalog.domain.Grade;
import com.mentormatching.modules.catalog.domain.Subject;
import com.mentormatching.modules.catalog.presentation.admin.dto.request.CreateGradeRequest;
import com.mentormatching.modules.catalog.presentation.admin.dto.request.CreateSubjectRequest;
import com.mentormatching.modules.catalog.presentation.admin.dto.request.UpdateGradeRequest;
import com.mentormatching.modules.catalog.presentation.admin.dto.request.UpdateSubjectRequest;
import com.mentormatching.modules.catalog.presentation.dto.response.CatalogOptionsResponse;
import com.mentormatching.shared.response.ApiResponse;
import com.mentormatching.shared.response.ApiResponseFactory;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@Validated
@Slf4j
@RequestMapping("/api/v1/admin/catalog")
public class AdminCatalogController {

    private final ManageSubjectUseCase manageSubjectUseCase;
    private final ManageGradeUseCase manageGradeUseCase;
    private final ApiResponseFactory apiResponseFactory;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/subjects")
    public ApiResponse<CatalogOptionsResponse.SubjectOptionResponse> createSubject(@Valid @RequestBody CreateSubjectRequest request) {
        CreateSubjectCommand command = new CreateSubjectCommand(
                request.categoryId(),
                request.name(),
                request.description()
        );
        Subject created = manageSubjectUseCase.createSubject(command);
        CatalogOptionsResponse.SubjectOptionResponse responseDto = new CatalogOptionsResponse.SubjectOptionResponse(
                created.getId(), created.getCategoryId(), created.getName(), created.getDescription());
        return apiResponseFactory.success(responseDto, "Subject created successfully");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/subjects/{id}")
    public ApiResponse<CatalogOptionsResponse.SubjectOptionResponse> updateSubject(@PathVariable Long id, @Valid @RequestBody UpdateSubjectRequest request) {
        UpdateSubjectCommand command = new UpdateSubjectCommand(
                id,
                request.categoryId(),
                request.name(),
                request.description()
        );
        Subject updated = manageSubjectUseCase.updateSubject(command);
        CatalogOptionsResponse.SubjectOptionResponse responseDto = new CatalogOptionsResponse.SubjectOptionResponse(
                updated.getId(), updated.getCategoryId(), updated.getName(), updated.getDescription());
        return apiResponseFactory.success(responseDto, "Subject updated successfully");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/subjects/{id}")
    public ApiResponse<Void> deleteSubject(@PathVariable Long id) {
        manageSubjectUseCase.deleteSubject(id);
        return apiResponseFactory.success(null, "Subject deleted successfully");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/grades")
    public ApiResponse<CatalogOptionsResponse.GradeOptionResponse> createGrade(@Valid @RequestBody CreateGradeRequest request) {
        CreateGradeCommand command = new CreateGradeCommand(
                request.name(),
                request.levelGroup()
        );
        Grade created = manageGradeUseCase.createGrade(command);
        CatalogOptionsResponse.GradeOptionResponse responseDto = new CatalogOptionsResponse.GradeOptionResponse(
                created.getId(), created.getName(), created.getLevelGroup().name());
        return apiResponseFactory.success(responseDto, "Grade created successfully");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/grades/{id}")
    public ApiResponse<CatalogOptionsResponse.GradeOptionResponse> updateGrade(@PathVariable Long id, @Valid @RequestBody UpdateGradeRequest request) {
        UpdateGradeCommand command = new UpdateGradeCommand(
                id,
                request.name(),
                request.levelGroup()
        );
        Grade updated = manageGradeUseCase.updateGrade(command);
        CatalogOptionsResponse.GradeOptionResponse responseDto = new CatalogOptionsResponse.GradeOptionResponse(
                updated.getId(), updated.getName(), updated.getLevelGroup().name());
        return apiResponseFactory.success(responseDto, "Grade updated successfully");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/grades/{id}")
    public ApiResponse<Void> deleteGrade(@PathVariable Long id) {
        manageGradeUseCase.deleteGrade(id);
        return apiResponseFactory.success(null, "Grade deleted successfully");
    }
}
