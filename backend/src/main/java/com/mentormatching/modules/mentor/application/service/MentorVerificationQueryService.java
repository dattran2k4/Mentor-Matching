package com.mentormatching.modules.mentor.application.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mentormatching.modules.mentor.application.dto.AdminMentorVerificationDetail;
import com.mentormatching.modules.mentor.application.dto.AdminMentorVerificationListItem;
import com.mentormatching.modules.mentor.application.dto.CurrentMentorVerificationDetails;
import com.mentormatching.modules.mentor.application.dto.GetAdminMentorVerificationsQuery;
import com.mentormatching.modules.mentor.application.port.in.GetAdminMentorVerificationDetailUseCase;
import com.mentormatching.modules.mentor.application.port.in.GetAdminMentorVerificationsUseCase;
import com.mentormatching.modules.mentor.application.port.in.GetCurrentMentorVerificationUseCase;
import com.mentormatching.modules.mentor.application.port.out.MentorProfileRepositoryPort;
import com.mentormatching.modules.mentor.application.port.out.MentorReadRepositoryPort;
import com.mentormatching.modules.mentor.application.port.out.MentorVerificationRepositoryPort;
import com.mentormatching.modules.mentor.domain.MentorProfile;
import com.mentormatching.modules.mentor.domain.MentorVerification;
import com.mentormatching.shared.exception.ResourceNotFoundException;
import com.mentormatching.shared.response.PageResponse;

@Service
@Transactional(readOnly = true)
public class MentorVerificationQueryService implements GetCurrentMentorVerificationUseCase,
        GetAdminMentorVerificationsUseCase, GetAdminMentorVerificationDetailUseCase {

    private static final String UNVERIFIED = "UNVERIFIED";

    private final MentorProfileRepositoryPort mentorProfileRepositoryPort;
    private final MentorReadRepositoryPort mentorReadRepositoryPort;
    private final MentorVerificationRepositoryPort mentorVerificationRepositoryPort;

    public MentorVerificationQueryService(MentorProfileRepositoryPort mentorProfileRepositoryPort,
                                          MentorReadRepositoryPort mentorReadRepositoryPort,
                                          MentorVerificationRepositoryPort mentorVerificationRepositoryPort) {
        this.mentorProfileRepositoryPort = mentorProfileRepositoryPort;
        this.mentorReadRepositoryPort = mentorReadRepositoryPort;
        this.mentorVerificationRepositoryPort = mentorVerificationRepositoryPort;
    }

    @Override
    public CurrentMentorVerificationDetails getCurrentMentorVerification(Long userId) {
        MentorProfile mentorProfile = mentorProfileRepositoryPort.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor profile not found"));

        return mentorVerificationRepositoryPort.findByMentorId(mentorProfile.getId())
                .map(this::toDetails)
                .orElseGet(() -> new CurrentMentorVerificationDetails(null, mentorProfile.getId(), null, null, null,
                        null, null, UNVERIFIED, null, null, null, null, null));
    }

    @Override
    public PageResponse<AdminMentorVerificationListItem> getAdminMentorVerifications(
            GetAdminMentorVerificationsQuery query) {
        return mentorReadRepositoryPort.findAdminMentorVerifications(query);
    }

    @Override
    public AdminMentorVerificationDetail getAdminMentorVerificationDetail(Long verificationId) {
        return mentorReadRepositoryPort.findAdminMentorVerificationDetailById(verificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor verification not found"));
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
}
