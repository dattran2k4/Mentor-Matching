package com.mentormatching.modules.media.presentation.dto.response;

import com.mentormatching.modules.media.application.dto.MediaAssetDetails;
import com.mentormatching.modules.media.domain.MediaAccessType;
import com.mentormatching.modules.media.domain.MediaProvider;
import com.mentormatching.modules.media.domain.MediaPurpose;
import com.mentormatching.modules.media.domain.MediaResourceType;
import com.mentormatching.modules.media.domain.MediaStatus;

public record MediaAssetResponse(
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
        MediaStatus status
) {

    public static MediaAssetResponse from(MediaAssetDetails mediaAsset) {
        return new MediaAssetResponse(mediaAsset.id(), mediaAsset.provider(), mediaAsset.objectKey(),
                mediaAsset.deliveryUrl(), mediaAsset.resourceType(), mediaAsset.mimeType(),
                mediaAsset.fileSizeBytes(), mediaAsset.width(), mediaAsset.height(), mediaAsset.accessType(),
                mediaAsset.purpose(), mediaAsset.status());
    }
}
