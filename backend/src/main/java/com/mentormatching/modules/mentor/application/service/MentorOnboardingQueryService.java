package com.mentormatching.modules.mentor.application.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.mentormatching.modules.mentor.application.dto.CurrentMentorOnboardingStatus;
import com.mentormatching.modules.mentor.application.port.in.GetCurrentMentorOnboardingStatusUseCase;
import com.mentormatching.modules.mentor.application.port.out.MentorHighlightRepositoryPort;
import com.mentormatching.modules.mentor.application.port.out.MentorPersonalityRepositoryPort;
import com.mentormatching.modules.mentor.application.port.out.MentorProfileRepositoryPort;
import com.mentormatching.modules.mentor.application.port.out.MentorReadRepositoryPort;
import com.mentormatching.modules.mentor.application.port.out.MentorSubjectRepositoryPort;
import com.mentormatching.modules.mentor.application.port.out.MentorVerificationRepositoryPort;
import com.mentormatching.modules.mentor.domain.MentorApprovalStatus;
import com.mentormatching.modules.mentor.domain.MentorProfile;
import com.mentormatching.modules.mentor.domain.MentorVerification;
import com.mentormatching.modules.mentor.domain.MentorVerificationStatus;

@Service
public class MentorOnboardingQueryService implements GetCurrentMentorOnboardingStatusUseCase {

    private final MentorProfileRepositoryPort mentorProfileRepositoryPort;
    private final MentorVerificationRepositoryPort mentorVerificationRepositoryPort;
    private final MentorSubjectRepositoryPort mentorSubjectRepositoryPort;
    private final MentorPersonalityRepositoryPort mentorPersonalityRepositoryPort;
    private final MentorHighlightRepositoryPort mentorHighlightRepositoryPort;
    private final MentorReadRepositoryPort mentorReadRepositoryPort;

    public MentorOnboardingQueryService(MentorProfileRepositoryPort mentorProfileRepositoryPort,
                                        MentorVerificationRepositoryPort mentorVerificationRepositoryPort,
                                        MentorSubjectRepositoryPort mentorSubjectRepositoryPort,
                                        MentorPersonalityRepositoryPort mentorPersonalityRepositoryPort,
                                        MentorHighlightRepositoryPort mentorHighlightRepositoryPort,
                                        MentorReadRepositoryPort mentorReadRepositoryPort) {
        this.mentorProfileRepositoryPort = mentorProfileRepositoryPort;
        this.mentorVerificationRepositoryPort = mentorVerificationRepositoryPort;
        this.mentorSubjectRepositoryPort = mentorSubjectRepositoryPort;
        this.mentorPersonalityRepositoryPort = mentorPersonalityRepositoryPort;
        this.mentorHighlightRepositoryPort = mentorHighlightRepositoryPort;
        this.mentorReadRepositoryPort = mentorReadRepositoryPort;
    }

    @Override
    public CurrentMentorOnboardingStatus getCurrentMentorOnboardingStatus(Long userId) {
        Optional<MentorProfile> mentorProfileOptional = mentorProfileRepositoryPort.findByUserId(userId);
        if (mentorProfileOptional.isEmpty()) {
            return new CurrentMentorOnboardingStatus(false, false, false, null, 0, 0, 0, 0, null, false);
        }

        MentorProfile mentorProfile = mentorProfileOptional.get();
        Long mentorId = mentorProfile.getId();
        Optional<MentorVerification> verification = mentorVerificationRepositoryPort.findByMentorId(mentorId);
        MentorVerificationStatus verificationStatus = verification.map(MentorVerification::getVerificationStatus)
                .orElse(null);
        MentorApprovalStatus approvalStatus = mentorProfile.getApprovalStatus();

        return new CurrentMentorOnboardingStatus(
                true,
                isProfileDetailsCompleted(mentorProfile),
                verification.isPresent(),
                verificationStatus,
                mentorSubjectRepositoryPort.findByMentorId(mentorId).size(),
                mentorPersonalityRepositoryPort.findByMentorId(mentorId).size(),
                mentorHighlightRepositoryPort.findByMentorId(mentorId).size(),
                mentorReadRepositoryPort.findMentorAchievements(mentorId).size(),
                approvalStatus,
                approvalStatus == MentorApprovalStatus.APPROVED
        );
    }

    private boolean isProfileDetailsCompleted(MentorProfile mentorProfile) {
        return hasText(mentorProfile.getAvatarUrl())
                && hasText(mentorProfile.getHeadline())
                && hasText(mentorProfile.getIntroduction())
                && hasText(mentorProfile.getTeachingStyle())
                && mentorProfile.getExperienceYears() != null
                && hasText(mentorProfile.getCurrentPosition())
                && hasText(mentorProfile.getWorkplace())
                && hasText(mentorProfile.getEducation())
                && hasText(mentorProfile.getMajor())
                && mentorProfile.getMeetingType() != null;
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
