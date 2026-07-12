package com.mentormatching.modules.review.infrastructure.lookup;

import org.springframework.stereotype.Component;

import com.mentormatching.modules.mentor.application.dto.MentorSummary;
import com.mentormatching.modules.mentor.application.port.in.GetMentorSummaryUseCase;
import com.mentormatching.modules.review.application.port.out.ReviewMentorLookupPort;
import com.mentormatching.shared.exception.ResourceNotFoundException;

@Component
public class ReviewMentorLookupAdapter implements ReviewMentorLookupPort {

    private final GetMentorSummaryUseCase getMentorSummaryUseCase;

    public ReviewMentorLookupAdapter(GetMentorSummaryUseCase getMentorSummaryUseCase) {
        this.getMentorSummaryUseCase = getMentorSummaryUseCase;
    }

    @Override
    public Long getUserId(Long mentorId) {
        try {
            MentorSummary mentor = getMentorSummaryUseCase.getMentorSummary(mentorId);
            return mentor != null ? mentor.userId() : null;
        } catch (ResourceNotFoundException e) {
            return null;
        }
    }
}
