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

import com.mentormatching.modules.catalog.application.dto.command.CreateSubjectCommand;
import com.mentormatching.modules.catalog.application.dto.command.UpdateSubjectCommand;
import com.mentormatching.modules.catalog.application.port.in.ManageSubjectUseCase;
import com.mentormatching.modules.catalog.domain.Subject;
import com.mentormatching.modules.catalog.presentation.admin.dto.request.CreateSubjectRequest;
import com.mentormatching.modules.catalog.presentation.admin.dto.request.UpdateSubjectRequest;
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
    private final ApiResponseFactory apiResponseFactory;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/subjects")
    public ApiResponse<Subject> createSubject(@Valid @RequestBody CreateSubjectRequest request) {
        CreateSubjectCommand command = new CreateSubjectCommand(
                request.categoryId(),
                request.name(),
                request.description()
        );
        Subject created = manageSubjectUseCase.createSubject(command);
        return apiResponseFactory.success(created, "Subject created successfully");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/subjects/{id}")
    public ApiResponse<Subject> updateSubject(@PathVariable Long id, @Valid @RequestBody UpdateSubjectRequest request) {
        UpdateSubjectCommand command = new UpdateSubjectCommand(
                id,
                request.categoryId(),
                request.name(),
                request.description()
        );
        Subject updated = manageSubjectUseCase.updateSubject(command);
        return apiResponseFactory.success(updated, "Subject updated successfully");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/subjects/{id}")
    public ApiResponse<Void> deleteSubject(@PathVariable Long id) {
        manageSubjectUseCase.deleteSubject(id);
        return apiResponseFactory.success(null, "Subject deleted successfully");
    }
}
