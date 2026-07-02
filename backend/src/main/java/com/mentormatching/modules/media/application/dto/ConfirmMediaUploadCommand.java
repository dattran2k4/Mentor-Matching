package com.mentormatching.modules.media.application.dto;

public record ConfirmMediaUploadCommand(
        Long mediaAssetId,
        Long uploadedByUserId,
        String objectKey,
        String providerAssetId,
        String deliveryUrl,
        Long fileSizeBytes,
        Integer width,
        Integer height,
        String version,
        String etag,
        String metadataJson
) {
}
