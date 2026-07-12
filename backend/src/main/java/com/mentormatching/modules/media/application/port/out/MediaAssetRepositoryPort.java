package com.mentormatching.modules.media.application.port.out;

import java.util.Optional;

import com.mentormatching.modules.media.domain.MediaAsset;
import com.mentormatching.modules.media.domain.MediaProvider;

public interface MediaAssetRepositoryPort {

    MediaAsset save(MediaAsset mediaAsset);

    Optional<MediaAsset> findById(Long id);

    Optional<MediaAsset> findByProviderAndObjectKey(MediaProvider provider, String objectKey);
}
