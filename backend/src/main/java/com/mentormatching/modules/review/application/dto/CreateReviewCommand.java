package com.mentormatching.modules.review.application.dto;

public record CreateReviewCommand(
        Long studentUserId,
        Long bookingId,
        Integer rating,
        String comment
) {}
