package com.mentormatching.modules.media.infrastructure.persistence.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mentormatching.modules.media.domain.MediaProvider;
import com.mentormatching.modules.media.infrastructure.persistence.entity.MediaAssetJpaEntity;

public interface MediaAssetJpaRepository extends JpaRepository<MediaAssetJpaEntity, Long> {

    Optional<MediaAssetJpaEntity> findByProviderAndObjectKey(MediaProvider provider, String objectKey);
}
