package com.mentormatching.modules.media.application.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.mentormatching.modules.media.application.dto.MediaAssetDetails;
import com.mentormatching.modules.media.application.port.in.GetMediaAssetUseCase;
import com.mentormatching.modules.media.application.port.out.MediaAssetRepositoryPort;

@Service
public class GetMediaAssetService extends BaseMediaUseCaseService implements GetMediaAssetUseCase {

    public GetMediaAssetService(MediaAssetRepositoryPort mediaAssetRepositoryPort) {
        super(mediaAssetRepositoryPort);
    }

    @Override
    public Optional<MediaAssetDetails> findById(Long mediaAssetId) {
        return mediaAssetRepositoryPort.findById(mediaAssetId).map(this::toDetails);
    }
}
