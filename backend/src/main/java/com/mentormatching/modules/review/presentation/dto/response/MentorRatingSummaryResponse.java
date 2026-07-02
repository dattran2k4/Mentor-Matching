package com.mentormatching.modules.review.presentation.dto.response;

import java.util.Map;

import com.mentormatching.modules.review.application.dto.MentorRatingSummary;

public record MentorRatingSummaryResponse(
        Double averageRating,
        Long totalReviews,
        Map<Integer, Long> ratingDistribution
) {

    public static MentorRatingSummaryResponse from(MentorRatingSummary summary) {
        return new MentorRatingSummaryResponse(
                summary.averageRating(),
                summary.totalReviews(),
                summary.ratingDistribution()
        );
    }
}
