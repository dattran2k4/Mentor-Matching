package com.mentormatching.modules.mentor.presentation.dto.response;

import com.mentormatching.modules.mentor.application.dto.CurrentMentorOnboardingStatus;
import com.mentormatching.modules.mentor.domain.MentorApprovalStatus;
import com.mentormatching.modules.mentor.domain.MentorVerificationStatus;

public record CurrentMentorOnboardingStatusResponse(boolean mentorProfileCreated, boolean profileDetailsCompleted,
                                                    boolean verificationSubmitted,
                                                    MentorVerificationStatus verificationStatus, int subjectCount,
                                                    int personalityCount, int highlightCount, int achievementCount,
                                                    MentorApprovalStatus approvalStatus,
                                                    boolean onboardingCompleted) {

    public static CurrentMentorOnboardingStatusResponse from(CurrentMentorOnboardingStatus status) {
        return new CurrentMentorOnboardingStatusResponse(status.mentorProfileCreated(),
                status.profileDetailsCompleted(), status.verificationSubmitted(), status.verificationStatus(),
                status.subjectCount(), status.personalityCount(), status.highlightCount(),
                status.achievementCount(), status.approvalStatus(), status.onboardingCompleted());
    }
}
