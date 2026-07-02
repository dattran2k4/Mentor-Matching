package com.mentormatching.modules.review.application.dto;

import java.time.LocalDateTime;

public record ReviewDetail(
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
) {}
