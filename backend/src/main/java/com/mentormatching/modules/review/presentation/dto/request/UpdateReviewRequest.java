package com.mentormatching.modules.review.presentation.dto.request;

import com.mentormatching.modules.review.application.dto.UpdateReviewCommand;
import com.mentormatching.shared.security.model.AuthenticatedPrincipal;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record UpdateReviewRequest(
        @NotNull(message = "Rating is required")
        @Min(value = 1, message = "Rating must be at least 1")
        @Max(value = 5, message = "Rating must be at most 5")
        Integer rating,

        String comment
) {

    public UpdateReviewCommand toCommand(Long reviewId, AuthenticatedPrincipal principal) {
        return new UpdateReviewCommand(reviewId, principal.getId(), rating, comment);
    }
}
