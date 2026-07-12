package com.mentormatching.modules.catalog.presentation.admin.dto.request;

import com.mentormatching.modules.catalog.domain.GradeLevelGroup;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateGradeRequest(
        @NotBlank(message = "Grade name is required")
        @Size(max = 100, message = "Grade name cannot exceed 100 characters")
        String name,
        
        @NotNull(message = "Grade level group is required")
        GradeLevelGroup levelGroup
) {
}
