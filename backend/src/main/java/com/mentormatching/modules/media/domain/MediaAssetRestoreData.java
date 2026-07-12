package com.mentormatching.modules.media.domain;

import java.time.LocalDateTime;

public record MediaAssetRestoreData(
        Long id,
        MediaProvider provider,
        String bucketName,
        String objectKey,
        String providerAssetId,
        String deliveryUrl,
        MediaResourceType resourceType,
        String mimeType,
        String originalFilename,
        Long fileSizeBytes,
        Integer width,
        Integer height,
        MediaAccessType accessType,
        MediaPurpose purpose,
        MediaStatus status,
        Long uploadedByUserId,
        String version,
        String etag,
        String metadataJson,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
