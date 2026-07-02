package com.mentormatching.modules.mentor.application.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mentormatching.modules.mentor.application.dto.CurrentMentorOnboardingStatus;
import com.mentormatching.modules.mentor.application.port.in.GetCurrentMentorOnboardingStatusUseCase;
import com.mentormatching.modules.mentor.application.port.in.SubmitCurrentMentorApplicationUseCase;
import com.mentormatching.modules.mentor.application.port.out.MentorProfileRepositoryPort;
import com.mentormatching.modules.mentor.application.port.out.MentorSubjectRepositoryPort;
import com.mentormatching.modules.mentor.application.port.out.MentorVerificationRepositoryPort;
import com.mentormatching.modules.mentor.domain.MentorProfile;
import com.mentormatching.shared.exception.InvalidDataException;
import com.mentormatching.shared.exception.ResourceNotFoundException;

@Service
public class MentorApplicationSubmissionService implements SubmitCurrentMentorApplicationUseCase {

    private final MentorProfileRepositoryPort mentorProfileRepositoryPort;
    private final MentorVerificationRepositoryPort mentorVerificationRepositoryPort;
    private final MentorSubjectRepositoryPort mentorSubjectRepositoryPort;
    private final GetCurrentMentorOnboardingStatusUseCase getCurrentMentorOnboardingStatusUseCase;

    public MentorApplicationSubmissionService(MentorProfileRepositoryPort mentorProfileRepositoryPort,
                                              MentorVerificationRepositoryPort mentorVerificationRepositoryPort,
                                              MentorSubjectRepositoryPort mentorSubjectRepositoryPort,
                                              GetCurrentMentorOnboardingStatusUseCase getCurrentMentorOnboardingStatusUseCase) {
        this.mentorProfileRepositoryPort = mentorProfileRepositoryPort;
        this.mentorVerificationRepositoryPort = mentorVerificationRepositoryPort;
        this.mentorSubjectRepositoryPort = mentorSubjectRepositoryPort;
        this.getCurrentMentorOnboardingStatusUseCase = getCurrentMentorOnboardingStatusUseCase;
    }

    @Override
    @Transactional
    public CurrentMentorOnboardingStatus submitCurrentMentorApplication(Long userId) {
        MentorProfile mentorProfile = mentorProfileRepositoryPort.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor profile not found"));

        validateProfileDetails(mentorProfile);
        validateIdentitySubmitted(mentorProfile.getId());
        validateActiveSubject(mentorProfile.getId());

        mentorProfile.submitForReview();
        mentorProfileRepositoryPort.save(mentorProfile);

        return getCurrentMentorOnboardingStatusUseCase.getCurrentMentorOnboardingStatus(userId);
    }

    private void validateProfileDetails(MentorProfile mentorProfile) {
        if (!hasText(mentorProfile.getAvatarUrl())
                || !hasText(mentorProfile.getHeadline())
                || !hasText(mentorProfile.getIntroduction())
                || !hasText(mentorProfile.getTeachingStyle())
                || mentorProfile.getExperienceYears() == null
                || !hasText(mentorProfile.getCurrentPosition())
                || !hasText(mentorProfile.getWorkplace())
                || !hasText(mentorProfile.getEducation())
                || !hasText(mentorProfile.getMajor())
                || mentorProfile.getMeetingType() == null) {
            throw new InvalidDataException("Mentor profile details must be completed before submission");
        }
    }

    private void validateIdentitySubmitted(Long mentorId) {
        if (!mentorVerificationRepositoryPort.existsByMentorId(mentorId)) {
            throw new InvalidDataException("Mentor verification must be submitted before submission");
        }
    }

    private void validateActiveSubject(Long mentorId) {
        boolean hasActiveSubject = mentorSubjectRepositoryPort.findByMentorId(mentorId).stream()
                .anyMatch(subject -> Boolean.TRUE.equals(subject.getActive()));
        if (!hasActiveSubject) {
            throw new InvalidDataException("At least one active mentor subject is required before submission");
        }
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
