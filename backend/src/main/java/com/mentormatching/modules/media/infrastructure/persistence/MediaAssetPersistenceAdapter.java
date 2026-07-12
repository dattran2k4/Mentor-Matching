package com.mentormatching.modules.media.infrastructure.persistence;

import java.util.Optional;

import org.springframework.stereotype.Component;

import com.mentormatching.modules.media.application.port.out.MediaAssetRepositoryPort;
import com.mentormatching.modules.media.domain.MediaAsset;
import com.mentormatching.modules.media.domain.MediaProvider;
import com.mentormatching.modules.media.infrastructure.persistence.mapper.MediaAssetPersistenceMapper;
import com.mentormatching.modules.media.infrastructure.persistence.repository.MediaAssetJpaRepository;

@Component
public class MediaAssetPersistenceAdapter implements MediaAssetRepositoryPort {

    private final MediaAssetJpaRepository mediaAssetJpaRepository;
    private final MediaAssetPersistenceMapper mediaAssetPersistenceMapper;

    public MediaAssetPersistenceAdapter(MediaAssetJpaRepository mediaAssetJpaRepository,
                                        MediaAssetPersistenceMapper mediaAssetPersistenceMapper) {
        this.mediaAssetJpaRepository = mediaAssetJpaRepository;
        this.mediaAssetPersistenceMapper = mediaAssetPersistenceMapper;
    }

    @Override
    public MediaAsset save(MediaAsset mediaAsset) {
        return mediaAssetPersistenceMapper.toDomain(mediaAssetJpaRepository.save(mediaAssetPersistenceMapper.toEntity(mediaAsset)));
    }

    @Override
    public Optional<MediaAsset> findById(Long id) {
        return mediaAssetJpaRepository.findById(id).map(mediaAssetPersistenceMapper::toDomain);
    }

    @Override
    public Optional<MediaAsset> findByProviderAndObjectKey(MediaProvider provider, String objectKey) {
        return mediaAssetJpaRepository.findByProviderAndObjectKey(provider, objectKey)
                .map(mediaAssetPersistenceMapper::toDomain);
    }
}
