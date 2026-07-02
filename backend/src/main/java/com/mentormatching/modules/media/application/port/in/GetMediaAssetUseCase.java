package com.mentormatching.modules.media.application.port.in;

import java.util.Optional;

import com.mentormatching.modules.media.application.dto.MediaAssetDetails;

public interface GetMediaAssetUseCase {

    Optional<MediaAssetDetails> findById(Long mediaAssetId);
}
