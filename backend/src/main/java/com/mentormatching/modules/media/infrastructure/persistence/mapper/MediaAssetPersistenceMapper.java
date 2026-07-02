package com.mentormatching.modules.media.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;

import com.mentormatching.modules.media.domain.MediaAsset;
import com.mentormatching.modules.media.domain.MediaAssetRestoreData;
import com.mentormatching.modules.media.infrastructure.persistence.entity.MediaAssetJpaEntity;

@Component
public class MediaAssetPersistenceMapper {

    public MediaAsset toDomain(MediaAssetJpaEntity entity) {
        return MediaAsset.restore(new MediaAssetRestoreData(entity.getId(), entity.getProvider(),
                entity.getBucketName(), entity.getObjectKey(), entity.getProviderAssetId(), entity.getDeliveryUrl(),
                entity.getResourceType(), entity.getMimeType(), entity.getOriginalFilename(),
                entity.getFileSizeBytes(), entity.getWidth(), entity.getHeight(), entity.getAccessType(),
                entity.getPurpose(), entity.getStatus(), entity.getUploadedByUserId(), entity.getVersion(),
                entity.getEtag(), entity.getMetadataJson(), entity.getCreatedAt(), entity.getUpdatedAt()));
    }

    public MediaAssetJpaEntity toEntity(MediaAsset mediaAsset) {
        return MediaAssetJpaEntity.builder()
                .id(mediaAsset.getId())
                .provider(mediaAsset.getProvider())
                .bucketName(mediaAsset.getBucketName())
                .objectKey(mediaAsset.getObjectKey())
                .providerAssetId(mediaAsset.getProviderAssetId())
                .deliveryUrl(mediaAsset.getDeliveryUrl())
                .resourceType(mediaAsset.getResourceType())
                .mimeType(mediaAsset.getMimeType())
                .originalFilename(mediaAsset.getOriginalFilename())
                .fileSizeBytes(mediaAsset.getFileSizeBytes())
                .width(mediaAsset.getWidth())
                .height(mediaAsset.getHeight())
                .accessType(mediaAsset.getAccessType())
                .purpose(mediaAsset.getPurpose())
                .status(mediaAsset.getStatus())
                .uploadedByUserId(mediaAsset.getUploadedByUserId())
                .version(mediaAsset.getVersion())
                .etag(mediaAsset.getEtag())
                .metadataJson(mediaAsset.getMetadataJson())
                .createdAt(mediaAsset.getCreatedAt())
                .updatedAt(mediaAsset.getUpdatedAt())
                .build();
    }
}
