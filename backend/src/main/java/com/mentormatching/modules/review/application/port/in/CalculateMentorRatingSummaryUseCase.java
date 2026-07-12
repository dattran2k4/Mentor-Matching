package com.mentormatching.modules.review.application.port.in;

import com.mentormatching.modules.review.application.dto.MentorRatingSummary;

public interface CalculateMentorRatingSummaryUseCase {

    MentorRatingSummary calculateMentorRatingSummary(Long mentorId);
}
