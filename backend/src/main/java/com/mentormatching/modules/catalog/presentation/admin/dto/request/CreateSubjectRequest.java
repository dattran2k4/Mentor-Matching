package com.mentormatching.modules.catalog.presentation.admin.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateSubjectRequest(
        @NotNull(message = "Category ID is required")
        Long categoryId,
        
        @NotBlank(message = "Subject name is required")
        @Size(max = 100, message = "Subject name must not exceed 100 characters")
        String name,
        
        @Size(max = 500, message = "Subject description must not exceed 500 characters")
        String description
) {
}
