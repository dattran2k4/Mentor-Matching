package com.mentormatching.modules.media.application.dto;

import com.mentormatching.modules.media.domain.MediaPurpose;
import com.mentormatching.modules.media.domain.MediaResourceType;

public record CreateMediaUploadCommand(
        Long uploadedByUserId,
        MediaPurpose purpose,
        MediaResourceType resourceType,
        String originalFilename,
        String mimeType,
        Long fileSizeBytes
) {
}
