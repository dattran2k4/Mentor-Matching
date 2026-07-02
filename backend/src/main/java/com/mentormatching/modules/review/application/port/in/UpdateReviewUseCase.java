package com.mentormatching.modules.review.application.port.in;

import com.mentormatching.modules.review.application.dto.UpdateReviewCommand;

public interface UpdateReviewUseCase {

    void updateReview(UpdateReviewCommand command);
}
