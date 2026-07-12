package com.mentormatching.modules.review.application.port.in;

import java.util.List;

import com.mentormatching.modules.review.application.dto.ReviewDetail;

public interface GetMyReviewsUseCase {
    List<ReviewDetail> getMyReviews(Long studentId);
}
