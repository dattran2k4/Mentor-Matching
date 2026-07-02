package com.mentormatching.modules.review.application.dto;

import java.time.LocalDateTime;

public record MentorReviewItem(
        Long id,
        Long bookingId,
        Long studentUserId,
        String studentName,
        Integer rating,
        String comment,
        LocalDateTime createdAt
) {}
