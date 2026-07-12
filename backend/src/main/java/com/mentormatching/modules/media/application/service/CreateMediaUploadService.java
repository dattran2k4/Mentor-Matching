package com.mentormatching.modules.media.application.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mentormatching.modules.media.application.dto.CreateMediaUploadCommand;
import com.mentormatching.modules.media.application.dto.MediaUploadIntent;
import com.mentormatching.modules.media.application.port.in.CreateMediaUploadUseCase;
import com.mentormatching.modules.media.application.port.out.MediaAssetRepositoryPort;
import com.mentormatching.modules.media.application.port.out.MediaStoragePort;
import com.mentormatching.modules.media.application.port.out.MediaUploadPolicyPort;
import com.mentormatching.modules.media.domain.MediaAccessType;
import com.mentormatching.modules.media.domain.MediaAsset;
import com.mentormatching.modules.media.domain.MediaPurpose;
import com.mentormatching.modules.media.domain.MediaResourceType;
import com.mentormatching.shared.exception.InvalidDataException;

@Service
public class CreateMediaUploadService extends BaseMediaUseCaseService implements CreateMediaUploadUseCase {

    private final MediaStoragePort mediaStoragePort;
    private final MediaUploadPolicyPort mediaUploadPolicyPort;

    public CreateMediaUploadService(MediaAssetRepositoryPort mediaAssetRepositoryPort,
                                    MediaStoragePort mediaStoragePort,
                                    MediaUploadPolicyPort mediaUploadPolicyPort) {
        super(mediaAssetRepositoryPort);
        this.mediaStoragePort = mediaStoragePort;
        this.mediaUploadPolicyPort = mediaUploadPolicyPort;
    }

    @Override
    @Transactional
    public MediaUploadIntent createUpload(CreateMediaUploadCommand command) {
        validate(command);

        MediaAccessType accessType = resolveAccessType(command.purpose());
        String objectKey = mediaStoragePort.createObjectKey(command);
        MediaAsset mediaAsset = MediaAsset.createPending(mediaStoragePort.provider(), null, objectKey,
                command.resourceType(), accessType, command.purpose(), command.uploadedByUserId(),
                command.originalFilename(), command.mimeType());
        MediaAsset savedMediaAsset = mediaAssetRepositoryPort.save(mediaAsset);

        return mediaStoragePort.createUploadIntent(savedMediaAsset);
    }

    private void validate(CreateMediaUploadCommand command) {
        if (command == null) {
            throw new InvalidDataException("Create media upload command is required");
        }
        requireNotNull(command.uploadedByUserId(), "Uploaded user id is required");
        requireNotNull(command.purpose(), "Media purpose is required");
        requireNotNull(command.resourceType(), "Media resource type is required");

        if (command.fileSizeBytes() != null && command.fileSizeBytes() > mediaUploadPolicyPort.maxFileSizeBytes()) {
            throw new InvalidDataException("File size exceeds max allowed size");
        }

        if (command.purpose() == MediaPurpose.AVATAR && command.resourceType() != MediaResourceType.IMAGE) {
            throw new InvalidDataException("Avatar upload must be an image");
        }
    }

    private MediaAccessType resolveAccessType(MediaPurpose purpose) {
        return switch (purpose) {
            case AVATAR, ACHIEVEMENT, REVIEW_ATTACHMENT -> MediaAccessType.PUBLIC;
            case VERIFICATION -> MediaAccessType.PRIVATE;
        };
    }

    private static <T> void requireNotNull(T value, String message) {
        if (value == null) {
            throw new InvalidDataException(message);
        }
    }
}
