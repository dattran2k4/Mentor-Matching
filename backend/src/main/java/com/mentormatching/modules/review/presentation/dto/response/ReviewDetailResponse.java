package com.mentormatching.modules.review.presentation.dto.response;

import java.time.LocalDateTime;

import com.mentormatching.modules.review.application.dto.ReviewDetail;

public record ReviewDetailResponse(
        Long id,
        Long bookingId,
        Long studentUserId,
        String studentName,
        Long mentorId,
        String mentorName,
        Integer rating,
        String comment,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {

    public static ReviewDetailResponse from(ReviewDetail detail) {
        return new ReviewDetailResponse(
                detail.id(),
                detail.bookingId(),
                detail.studentUserId(),
                detail.studentName(),
                detail.mentorId(),
                detail.mentorName(),
                detail.rating(),
                detail.comment(),
                detail.createdAt(),
                detail.updatedAt()
        );
    }
}
