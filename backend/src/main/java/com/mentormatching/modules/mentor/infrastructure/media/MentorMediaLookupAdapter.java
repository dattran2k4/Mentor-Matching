package com.mentormatching.modules.mentor.infrastructure.media;

import org.springframework.stereotype.Component;

import com.mentormatching.modules.media.application.dto.MediaAssetDetails;
import com.mentormatching.modules.media.application.port.in.GetMediaAssetUseCase;
import com.mentormatching.modules.mentor.application.dto.MentorMediaAssetSummary;
import com.mentormatching.modules.mentor.application.port.out.MentorMediaLookupPort;
import com.mentormatching.shared.exception.ResourceNotFoundException;

@Component
public class MentorMediaLookupAdapter implements MentorMediaLookupPort {

    private final GetMediaAssetUseCase getMediaAssetUseCase;

    public MentorMediaLookupAdapter(GetMediaAssetUseCase getMediaAssetUseCase) {
        this.getMediaAssetUseCase = getMediaAssetUseCase;
    }

    @Override
    public MentorMediaAssetSummary getMediaAsset(Long mediaAssetId) {
        MediaAssetDetails mediaAsset = getMediaAssetUseCase.findById(mediaAssetId)
                .orElseThrow(() -> new ResourceNotFoundException("Media asset not found"));
        return new MentorMediaAssetSummary(mediaAsset.id(), mediaAsset.deliveryUrl(),
                mediaAsset.resourceType().name(), mediaAsset.accessType().name(), mediaAsset.purpose().name(),
                mediaAsset.status().name(), mediaAsset.uploadedByUserId());
    }
}
