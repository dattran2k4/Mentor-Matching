package com.mentormatching.modules.review.application.dto;

import java.util.Map;

public record MentorRatingSummary(
        Double averageRating,
        Long totalReviews,
        Map<Integer, Long> ratingDistribution
) {}
