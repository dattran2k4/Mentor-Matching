package com.mentormatching.modules.review.application.port.in;

import com.mentormatching.modules.review.application.dto.CreateReviewCommand;

public interface CreateReviewUseCase {

    Long createReview(CreateReviewCommand command);
}
