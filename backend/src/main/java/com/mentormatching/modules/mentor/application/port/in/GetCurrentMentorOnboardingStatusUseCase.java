package com.mentormatching.modules.mentor.application.port.in;

import com.mentormatching.modules.mentor.application.dto.CurrentMentorOnboardingStatus;

public interface GetCurrentMentorOnboardingStatusUseCase {

    CurrentMentorOnboardingStatus getCurrentMentorOnboardingStatus(Long userId);
}
