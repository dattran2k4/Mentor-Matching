package com.mentormatching.modules.review.infrastructure.lookup;

import org.springframework.stereotype.Component;

import com.mentormatching.modules.review.application.port.out.ReviewUserLookupPort;
import com.mentormatching.modules.user.application.dto.UserSummary;
import com.mentormatching.modules.user.application.port.in.GetUserSummaryUseCase;
import com.mentormatching.shared.exception.ResourceNotFoundException;

@Component
public class ReviewUserLookupAdapter implements ReviewUserLookupPort {

    private final GetUserSummaryUseCase getUserSummaryUseCase;

    public ReviewUserLookupAdapter(GetUserSummaryUseCase getUserSummaryUseCase) {
        this.getUserSummaryUseCase = getUserSummaryUseCase;
    }

    @Override
    public String getUserFullName(Long userId) {
        try {
            UserSummary user = getUserSummaryUseCase.getUserSummary(userId);
            return user != null ? user.fullName() : null;
        } catch (ResourceNotFoundException e) {
            return null;
        }
    }
}
