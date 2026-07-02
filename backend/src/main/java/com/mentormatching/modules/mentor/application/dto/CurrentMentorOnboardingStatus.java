package com.mentormatching.modules.mentor.application.dto;

import com.mentormatching.modules.mentor.domain.MentorApprovalStatus;
import com.mentormatching.modules.mentor.domain.MentorVerificationStatus;

public record CurrentMentorOnboardingStatus(boolean mentorProfileCreated, boolean profileDetailsCompleted,
                                            boolean verificationSubmitted,
                                            MentorVerificationStatus verificationStatus, int subjectCount,
                                            int personalityCount, int highlightCount, int achievementCount,
                                            MentorApprovalStatus approvalStatus, boolean onboardingCompleted) {
}
