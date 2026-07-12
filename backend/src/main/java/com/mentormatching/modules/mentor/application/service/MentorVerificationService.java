package com.mentormatching.modules.mentor.application.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

import com.mentormatching.modules.mentor.application.dto.CurrentMentorVerificationDetails;
import com.mentormatching.modules.mentor.application.dto.MentorMediaAssetSummary;
import com.mentormatching.modules.mentor.application.dto.UpsertCurrentMentorVerificationCommand;
import com.mentormatching.modules.mentor.application.port.in.UpsertCurrentMentorVerificationUseCase;
import com.mentormatching.modules.mentor.application.port.out.MentorMediaLookupPort;
import com.mentormatching.modules.mentor.application.port.out.MentorProfileRepositoryPort;
import com.mentormatching.modules.mentor.application.port.out.MentorVerificationRepositoryPort;
import com.mentormatching.modules.mentor.domain.MentorProfile;
import com.mentormatching.modules.mentor.domain.MentorVerification;
import com.mentormatching.shared.exception.InvalidDataException;
import com.mentormatching.shared.exception.ResourceNotFoundException;

@Service
public class MentorVerificationService implements UpsertCurrentMentorVerificationUseCase {

    private static final String PURPOSE_VERIFICATION = "VERIFICATION";
    private static final String RESOURCE_TYPE_IMAGE = "IMAGE";
    private static final String ACCESS_TYPE_PRIVATE = "PRIVATE";
    private static final String STATUS_READY = "READY";

    private final MentorProfileRepositoryPort mentorProfileRepositoryPort;
    private final MentorVerificationRepositoryPort mentorVerificationRepositoryPort;
    private final MentorMediaLookupPort mentorMediaLookupPort;

    @Autowired
    public MentorVerificationService(MentorProfileRepositoryPort mentorProfileRepositoryPort,
                                     MentorVerificationRepositoryPort mentorVerificationRepositoryPort,
                                     MentorMediaLookupPort mentorMediaLookupPort) {
        this.mentorProfileRepositoryPort = mentorProfileRepositoryPort;
        this.mentorVerificationRepositoryPort = mentorVerificationRepositoryPort;
        this.mentorMediaLookupPort = mentorMediaLookupPort;
    }

    MentorVerificationService(MentorProfileRepositoryPort mentorProfileRepositoryPort,
                              MentorVerificationRepositoryPort mentorVerificationRepositoryPort) {
        this(mentorProfileRepositoryPort, mentorVerificationRepositoryPort, null);
    }

    @Override
    @Transactional
    public CurrentMentorVerificationDetails upsertCurrentMentorVerification(UpsertCurrentMentorVerificationCommand command) {
        MentorProfile mentorProfile = mentorProfileRepositoryPort.findByUserId(command.userId())
                .orElseThrow(() -> new ResourceNotFoundException("Mentor profile not found"));
        VerificationMedia verificationMedia = resolveVerificationMedia(command);

        MentorVerification verification = mentorVerificationRepositoryPort.findByMentorId(mentorProfile.getId())
                .map(existing -> resubmit(existing, command))
                .orElseGet(() -> MentorVerification.submit(mentorProfile.getId(), command.fullName(),
                        command.idCardNumber(), verificationMedia.idCardFrontUrl(),
                        verificationMedia.idCardFrontMediaId(), verificationMedia.idCardBackUrl(),
                        verificationMedia.idCardBackMediaId(), verificationMedia.selfieWithIdUrl(),
                        verificationMedia.selfieWithIdMediaId()));

        MentorVerification savedVerification = mentorVerificationRepositoryPort.save(verification);
        return toDetails(savedVerification);
    }

    private MentorVerification resubmit(MentorVerification verification,
                                        UpsertCurrentMentorVerificationCommand command) {
        VerificationMedia verificationMedia = resolveVerificationMedia(command);
        verification.resubmit(command.fullName(), command.idCardNumber(), verificationMedia.idCardFrontUrl(),
                verificationMedia.idCardFrontMediaId(), verificationMedia.idCardBackUrl(),
                verificationMedia.idCardBackMediaId(), verificationMedia.selfieWithIdUrl(),
                verificationMedia.selfieWithIdMediaId());
        return verification;
    }

    private CurrentMentorVerificationDetails toDetails(MentorVerification verification) {
        return new CurrentMentorVerificationDetails(verification.getId(), verification.getMentorId(),
                verification.getFullName(), verification.getIdCardNumber(), verification.getIdCardFrontUrl(),
                verification.getIdCardFrontMediaId(), verification.getIdCardBackUrl(),
                verification.getIdCardBackMediaId(), verification.getSelfieWithIdUrl(),
                verification.getSelfieWithIdMediaId(),
                verification.getVerificationStatus().name(), verification.getVerifiedBy(),
                verification.getVerifiedAt(), verification.getRejectionReason(), verification.getCreatedAt(),
                verification.getUpdatedAt());
    }

    private VerificationMedia resolveVerificationMedia(UpsertCurrentMentorVerificationCommand command) {
        if (command.idCardFrontMediaId() == null && command.idCardBackMediaId() == null
                && command.selfieWithIdMediaId() == null) {
            return new VerificationMedia(command.idCardFrontUrl(), null, command.idCardBackUrl(), null,
                    command.selfieWithIdUrl(), null);
        }
        if (mentorMediaLookupPort == null) {
            throw new InvalidDataException("Mentor media lookup is required");
        }

        MentorMediaAssetSummary front = getAndValidateVerificationMedia(command.idCardFrontMediaId(), command.userId(),
                "ID card front media");
        MentorMediaAssetSummary back = getAndValidateVerificationMedia(command.idCardBackMediaId(), command.userId(),
                "ID card back media");
        MentorMediaAssetSummary selfie = command.selfieWithIdMediaId() == null ? null
                : getAndValidateVerificationMedia(command.selfieWithIdMediaId(), command.userId(),
                "Selfie with ID media");

        return new VerificationMedia(front.deliveryUrl(), front.id(), back.deliveryUrl(), back.id(),
                selfie == null ? null : selfie.deliveryUrl(), selfie == null ? null : selfie.id());
    }

    private MentorMediaAssetSummary getAndValidateVerificationMedia(Long mediaAssetId, Long userId, String label) {
        if (mediaAssetId == null) {
            throw new InvalidDataException(label + " id is required");
        }

        MentorMediaAssetSummary mediaAsset = mentorMediaLookupPort.getMediaAsset(mediaAssetId);
        if (!STATUS_READY.equals(mediaAsset.status())) {
            throw new InvalidDataException(label + " must be ready");
        }
        if (!userId.equals(mediaAsset.uploadedByUserId())) {
            throw new InvalidDataException("You are not authorized to use " + label);
        }
        if (!PURPOSE_VERIFICATION.equals(mediaAsset.purpose())) {
            throw new InvalidDataException(label + " purpose must be verification");
        }
        if (!RESOURCE_TYPE_IMAGE.equals(mediaAsset.resourceType())) {
            throw new InvalidDataException(label + " must be an image");
        }
        if (!ACCESS_TYPE_PRIVATE.equals(mediaAsset.accessType())) {
            throw new InvalidDataException(label + " must be private");
        }
        if (mediaAsset.deliveryUrl() == null || mediaAsset.deliveryUrl().isBlank()) {
            throw new InvalidDataException(label + " delivery url is required");
        }
        return mediaAsset;
    }

    private record VerificationMedia(String idCardFrontUrl, Long idCardFrontMediaId, String idCardBackUrl,
                                     Long idCardBackMediaId, String selfieWithIdUrl, Long selfieWithIdMediaId) {
    }
}
