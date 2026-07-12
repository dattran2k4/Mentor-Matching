package com.mentormatching.modules.media.application.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mentormatching.modules.media.application.dto.ConfirmMediaUploadCommand;
import com.mentormatching.modules.media.application.dto.MediaAssetDetails;
import com.mentormatching.modules.media.application.port.in.ConfirmMediaUploadUseCase;
import com.mentormatching.modules.media.application.port.out.MediaAssetRepositoryPort;
import com.mentormatching.modules.media.application.port.out.MediaStoragePort;
import com.mentormatching.modules.media.domain.MediaAsset;
import com.mentormatching.modules.media.domain.MediaStatus;
import com.mentormatching.shared.exception.InvalidDataException;
import com.mentormatching.shared.exception.ResourceNotFoundException;

@Service
public class ConfirmMediaUploadService extends BaseMediaUseCaseService implements ConfirmMediaUploadUseCase {

    private final MediaStoragePort mediaStoragePort;

    public ConfirmMediaUploadService(MediaAssetRepositoryPort mediaAssetRepositoryPort,
                                     MediaStoragePort mediaStoragePort) {
        super(mediaAssetRepositoryPort);
        this.mediaStoragePort = mediaStoragePort;
    }

    @Override
    @Transactional
    public MediaAssetDetails confirmUpload(ConfirmMediaUploadCommand command) {
        validate(command);

        MediaAsset mediaAsset = mediaAssetRepositoryPort.findById(command.mediaAssetId())
                .orElseThrow(() -> new ResourceNotFoundException("Media asset not found"));

        validateConfirmable(mediaAsset, command);

        if (mediaAsset.isReady()) {
            return toDetails(mediaAsset);
        }

        mediaStoragePort.verifyUpload(mediaAsset, command);
        mediaAsset.markReady(command.providerAssetId(), command.deliveryUrl(), command.fileSizeBytes(),
                command.width(), command.height(), command.version(), command.etag(), command.metadataJson());

        return toDetails(mediaAssetRepositoryPort.save(mediaAsset));
    }

    private void validate(ConfirmMediaUploadCommand command) {
        if (command == null) {
            throw new InvalidDataException("Confirm media upload command is required");
        }
        requireNotNull(command.mediaAssetId(), "Media asset id is required");
        requireNotNull(command.uploadedByUserId(), "Uploaded user id is required");
        requireNotBlank(command.objectKey(), "Media object key is required");
        requireNotBlank(command.deliveryUrl(), "Media delivery url is required");
    }

    private void validateConfirmable(MediaAsset mediaAsset, ConfirmMediaUploadCommand command) {
        if (!mediaAsset.isOwnedBy(command.uploadedByUserId())) {
            throw new InvalidDataException("You are not authorized to confirm this media asset");
        }
        if (!mediaAsset.getObjectKey().equals(command.objectKey())) {
            throw new InvalidDataException("Media object key does not match upload intent");
        }
        if (mediaAsset.getStatus() == MediaStatus.DELETED) {
            throw new InvalidDataException("Deleted media asset cannot be confirmed");
        }
    }

    private static <T> void requireNotNull(T value, String message) {
        if (value == null) {
            throw new InvalidDataException(message);
        }
    }

    private static void requireNotBlank(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new InvalidDataException(message);
        }
    }
}
