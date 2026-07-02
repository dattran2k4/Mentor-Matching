package com.mentormatching.modules.media.presentation.dto.request;

import com.mentormatching.modules.media.application.dto.CreateMediaUploadCommand;
import com.mentormatching.modules.media.domain.MediaPurpose;
import com.mentormatching.modules.media.domain.MediaResourceType;
import com.mentormatching.shared.security.model.AuthenticatedPrincipal;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateMediaUploadIntentRequest(
        @NotNull(message = "Media purpose is required")
        MediaPurpose purpose,

        @NotNull(message = "Media resource type is required")
        MediaResourceType resourceType,

        @Size(max = 255, message = "Original filename must not exceed 255 characters")
        String originalFilename,

        @Size(max = 100, message = "Mime type must not exceed 100 characters")
        String mimeType,

        @Min(value = 0, message = "File size must not be negative")
        Long fileSizeBytes
) {

    public CreateMediaUploadCommand toCommand(AuthenticatedPrincipal principal) {
        return new CreateMediaUploadCommand(principal.getId(), purpose, resourceType, originalFilename, mimeType,
                fileSizeBytes);
    }
}
