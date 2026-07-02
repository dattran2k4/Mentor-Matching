package com.mentormatching.modules.mentor.application.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mentormatching.modules.mentor.application.dto.CurrentMentorDetails;
import com.mentormatching.modules.mentor.application.dto.MentorMediaAssetSummary;
import com.mentormatching.modules.mentor.application.dto.UpdateCurrentMentorAvatarCommand;
import com.mentormatching.modules.mentor.application.port.in.UpdateCurrentMentorAvatarUseCase;
import com.mentormatching.modules.mentor.application.port.out.MentorMediaLookupPort;
import com.mentormatching.modules.mentor.application.port.out.MentorProfileRepositoryPort;
import com.mentormatching.modules.mentor.application.port.out.MentorReadRepositoryPort;
import com.mentormatching.modules.mentor.domain.MentorProfile;
import com.mentormatching.shared.exception.InvalidDataException;
import com.mentormatching.shared.exception.ResourceNotFoundException;

@Service
public class MentorAvatarService implements UpdateCurrentMentorAvatarUseCase {

    private static final String PURPOSE_AVATAR = "AVATAR";
    private static final String RESOURCE_TYPE_IMAGE = "IMAGE";
    private static final String ACCESS_TYPE_PUBLIC = "PUBLIC";
    private static final String STATUS_READY = "READY";

    private final MentorProfileRepositoryPort mentorProfileRepositoryPort;
    private final MentorReadRepositoryPort mentorReadRepositoryPort;
    private final MentorMediaLookupPort mentorMediaLookupPort;

    public MentorAvatarService(MentorProfileRepositoryPort mentorProfileRepositoryPort,
                               MentorReadRepositoryPort mentorReadRepositoryPort,
                               MentorMediaLookupPort mentorMediaLookupPort) {
        this.mentorProfileRepositoryPort = mentorProfileRepositoryPort;
        this.mentorReadRepositoryPort = mentorReadRepositoryPort;
        this.mentorMediaLookupPort = mentorMediaLookupPort;
    }

    @Override
    @Transactional
    public CurrentMentorDetails updateCurrentMentorAvatar(UpdateCurrentMentorAvatarCommand command) {
        validate(command);

        MentorProfile mentorProfile = mentorProfileRepositoryPort.findByUserId(command.userId())
                .orElseThrow(() -> new ResourceNotFoundException("Mentor profile not found"));
        MentorMediaAssetSummary mediaAsset = mentorMediaLookupPort.getMediaAsset(command.avatarMediaId());
        validateAvatarMedia(command.userId(), mediaAsset);

        mentorProfile.updateAvatar(mediaAsset.id(), mediaAsset.deliveryUrl());
        MentorProfile savedMentorProfile = mentorProfileRepositoryPort.save(mentorProfile);

        return mentorReadRepositoryPort.findCurrentMentorByMentorId(savedMentorProfile.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Mentor profile not found"));
    }

    private void validate(UpdateCurrentMentorAvatarCommand command) {
        if (command == null) {
            throw new InvalidDataException("Update mentor avatar command is required");
        }
        if (command.userId() == null) {
            throw new InvalidDataException("User id is required");
        }
        if (command.avatarMediaId() == null) {
            throw new InvalidDataException("Avatar media id is required");
        }
    }

    private void validateAvatarMedia(Long userId, MentorMediaAssetSummary mediaAsset) {
        if (!STATUS_READY.equals(mediaAsset.status())) {
            throw new InvalidDataException("Avatar media must be ready");
        }
        if (!userId.equals(mediaAsset.uploadedByUserId())) {
            throw new InvalidDataException("You are not authorized to use this avatar media");
        }
        if (!PURPOSE_AVATAR.equals(mediaAsset.purpose())) {
            throw new InvalidDataException("Media purpose must be avatar");
        }
        if (!RESOURCE_TYPE_IMAGE.equals(mediaAsset.resourceType())) {
            throw new InvalidDataException("Avatar media must be an image");
        }
        if (!ACCESS_TYPE_PUBLIC.equals(mediaAsset.accessType())) {
            throw new InvalidDataException("Avatar media must be public");
        }
        if (mediaAsset.deliveryUrl() == null || mediaAsset.deliveryUrl().isBlank()) {
            throw new InvalidDataException("Avatar media delivery url is required");
        }
    }
}
