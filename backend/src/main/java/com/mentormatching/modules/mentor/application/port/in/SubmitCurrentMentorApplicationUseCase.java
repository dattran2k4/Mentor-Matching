package com.mentormatching.modules.mentor.application.port.in;

import com.mentormatching.modules.mentor.application.dto.CurrentMentorOnboardingStatus;

public interface SubmitCurrentMentorApplicationUseCase {

    CurrentMentorOnboardingStatus submitCurrentMentorApplication(Long userId);
}
