package com.mentormatching.modules.media.presentation.dto.request;

import com.mentormatching.modules.media.application.dto.ConfirmMediaUploadCommand;
import com.mentormatching.shared.security.model.AuthenticatedPrincipal;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ConfirmMediaUploadRequest(
        @NotBlank(message = "Media object key is required")
        @Size(max = 500, message = "Media object key must not exceed 500 characters")
        String objectKey,

        @NotBlank(message = "Provider asset id is required")
        @Size(max = 255, message = "Provider asset id must not exceed 255 characters")
        String providerAssetId,

        @NotBlank(message = "Delivery url is required")
        String deliveryUrl,

        @Min(value = 0, message = "File size must not be negative")
        Long fileSizeBytes,

        @Min(value = 0, message = "Width must not be negative")
        Integer width,

        @Min(value = 0, message = "Height must not be negative")
        Integer height,

        @Size(max = 100, message = "Version must not exceed 100 characters")
        String version,

        @Size(max = 255, message = "Etag must not exceed 255 characters")
        String etag,

        String metadataJson
) {

    public ConfirmMediaUploadCommand toCommand(AuthenticatedPrincipal principal, Long mediaAssetId) {
        return new ConfirmMediaUploadCommand(mediaAssetId, principal.getId(), objectKey, providerAssetId, deliveryUrl,
                fileSizeBytes, width, height, version, etag, metadataJson);
    }
}
