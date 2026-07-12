package com.mentormatching.modules.media.infrastructure.cloudinary;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.cloudinary")
public record CloudinaryProperties(String cloudName, String apiKey, String apiSecret, String uploadFolder) {

    public CloudinaryProperties {
        cloudName = cloudName == null ? "" : cloudName;
        apiKey = apiKey == null ? "" : apiKey;
        apiSecret = apiSecret == null ? "" : apiSecret;
        uploadFolder = uploadFolder == null || uploadFolder.isBlank() ? "mentor-matching" : uploadFolder;
    }
}
