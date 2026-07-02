package com.mentormatching.modules.media.presentation.dto.response;

import java.util.Map;

import com.mentormatching.modules.media.application.dto.MediaUploadIntent;

public record MediaUploadIntentResponse(
        Long mediaAssetId,
        String provider,
        String uploadUrl,
        String objectKey,
        Map<String, String> formFields
) {

    public static MediaUploadIntentResponse from(MediaUploadIntent uploadIntent) {
        return new MediaUploadIntentResponse(uploadIntent.mediaAssetId(), uploadIntent.provider(),
                uploadIntent.uploadUrl(), uploadIntent.objectKey(), uploadIntent.formFields());
    }
}
