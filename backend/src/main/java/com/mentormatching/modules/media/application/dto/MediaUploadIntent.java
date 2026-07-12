package com.mentormatching.modules.media.application.dto;

import java.util.Map;

public record MediaUploadIntent(
        Long mediaAssetId,
        String provider,
        String uploadUrl,
        String objectKey,
        Map<String, String> formFields
) {
}
