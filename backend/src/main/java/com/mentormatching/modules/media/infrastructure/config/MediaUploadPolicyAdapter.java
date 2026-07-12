package com.mentormatching.modules.media.infrastructure.config;

import org.springframework.stereotype.Component;

import com.mentormatching.modules.media.application.port.out.MediaUploadPolicyPort;

@Component
public class MediaUploadPolicyAdapter implements MediaUploadPolicyPort {

    private final MediaProperties mediaProperties;

    public MediaUploadPolicyAdapter(MediaProperties mediaProperties) {
        this.mediaProperties = mediaProperties;
    }

    @Override
    public long maxFileSizeBytes() {
        return mediaProperties.maxFileSizeBytes();
    }
}
