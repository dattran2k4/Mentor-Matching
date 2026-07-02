package com.mentormatching.modules.review.presentation.dto.request;

import com.mentormatching.modules.review.application.dto.CreateReviewCommand;
import com.mentormatching.shared.security.model.AuthenticatedPrincipal;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CreateReviewRequest(
        @NotNull(message = "Booking ID is required")
        Long bookingId,

        @NotNull(message = "Rating is required")
        @Min(value = 1, message = "Rating must be at least 1")
        @Max(value = 5, message = "Rating must be at most 5")
        Integer rating,

        String comment
) {

    public CreateReviewCommand toCommand(AuthenticatedPrincipal principal) {
        return new CreateReviewCommand(principal.getId(), bookingId, rating, comment);
    }
}
