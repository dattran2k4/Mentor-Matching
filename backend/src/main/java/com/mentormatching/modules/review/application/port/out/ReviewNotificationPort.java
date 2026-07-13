package com.mentormatching.modules.review.application.port.out;

public interface ReviewNotificationPort {
    void notifyReviewCreated(Long mentorUserId, int rating);
}
