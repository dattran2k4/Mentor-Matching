package com.mentormatching.modules.media.infrastructure.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import com.mentormatching.modules.media.domain.MediaProvider;

@ConfigurationProperties(prefix = "app.media")
public record MediaProperties(MediaProvider provider, long maxFileSizeBytes) {

    private static final long DEFAULT_MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

    public MediaProperties {
        provider = provider == null ? MediaProvider.CLOUDINARY : provider;
        maxFileSizeBytes = maxFileSizeBytes <= 0 ? DEFAULT_MAX_FILE_SIZE_BYTES : maxFileSizeBytes;
    }
}
