package com.mentormatching.modules.media.application.service;

import com.mentormatching.modules.media.application.dto.MediaAssetDetails;
import com.mentormatching.modules.media.application.port.out.MediaAssetRepositoryPort;
import com.mentormatching.modules.media.domain.MediaAsset;

abstract class BaseMediaUseCaseService {

    protected final MediaAssetRepositoryPort mediaAssetRepositoryPort;

    protected BaseMediaUseCaseService(MediaAssetRepositoryPort mediaAssetRepositoryPort) {
        this.mediaAssetRepositoryPort = mediaAssetRepositoryPort;
    }

    protected MediaAssetDetails toDetails(MediaAsset mediaAsset) {
        return new MediaAssetDetails(mediaAsset.getId(), mediaAsset.getProvider(), mediaAsset.getObjectKey(),
                mediaAsset.getDeliveryUrl(), mediaAsset.getResourceType(), mediaAsset.getMimeType(),
                mediaAsset.getFileSizeBytes(), mediaAsset.getWidth(), mediaAsset.getHeight(),
                mediaAsset.getAccessType(), mediaAsset.getPurpose(), mediaAsset.getStatus(),
                mediaAsset.getUploadedByUserId());
    }
}
