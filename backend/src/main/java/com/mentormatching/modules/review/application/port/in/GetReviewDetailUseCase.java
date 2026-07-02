package com.mentormatching.modules.review.application.port.in;

import com.mentormatching.modules.review.application.dto.ReviewDetail;

public interface GetReviewDetailUseCase {

    ReviewDetail getReviewDetail(Long id);
}
