package com.mentormatching.modules.media.application.dto;

import com.mentormatching.modules.media.domain.MediaAccessType;
import com.mentormatching.modules.media.domain.MediaProvider;
import com.mentormatching.modules.media.domain.MediaPurpose;
import com.mentormatching.modules.media.domain.MediaResourceType;
import com.mentormatching.modules.media.domain.MediaStatus;

public record MediaAssetDetails(
        Long id,
        MediaProvider provider,
        String objectKey,
        String deliveryUrl,
        MediaResourceType resourceType,
        String mimeType,
        Long fileSizeBytes,
        Integer width,
        Integer height,
        MediaAccessType accessType,
        MediaPurpose purpose,
        MediaStatus status,
        Long uploadedByUserId
) {
}
