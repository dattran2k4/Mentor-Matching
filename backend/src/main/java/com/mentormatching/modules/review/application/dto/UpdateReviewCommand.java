package com.mentormatching.modules.review.application.dto;

public record UpdateReviewCommand(
        Long reviewId,
        Long studentUserId,
        Integer rating,
        String comment
) {}
