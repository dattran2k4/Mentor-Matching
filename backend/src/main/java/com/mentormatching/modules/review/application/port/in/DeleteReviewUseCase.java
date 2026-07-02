package com.mentormatching.modules.review.application.port.in;

public interface DeleteReviewUseCase {

    void deleteReview(Long reviewId, Long currentUserId, boolean isAdminOrManager);
}
