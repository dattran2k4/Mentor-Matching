package com.mentormatching.modules.mentor.application.port.out;

import com.mentormatching.modules.mentor.application.dto.MentorMediaAssetSummary;

public interface MentorMediaLookupPort {

    MentorMediaAssetSummary getMediaAsset(Long mediaAssetId);
}
