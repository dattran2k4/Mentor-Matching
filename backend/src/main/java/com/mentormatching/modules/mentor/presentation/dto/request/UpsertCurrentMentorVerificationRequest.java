package com.mentormatching.modules.mentor.presentation.dto.request;

import com.mentormatching.modules.mentor.application.dto.UpsertCurrentMentorVerificationCommand;
import com.mentormatching.shared.security.model.AuthenticatedPrincipal;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpsertCurrentMentorVerificationRequest(
        @NotNull(message = "Full name is required")
        @Size(max = 255, message = "Full name must not exceed 255 characters")
        String fullName,

        @Size(max = 50, message = "ID card number must not exceed 50 characters")
        String idCardNumber,

        @NotNull(message = "ID card front media id is required")
        Long idCardFrontMediaId,

        @NotNull(message = "ID card back media id is required")
        Long idCardBackMediaId,

        Long selfieWithIdMediaId
) {

    public UpsertCurrentMentorVerificationCommand toCommand(AuthenticatedPrincipal principal) {
        return new UpsertCurrentMentorVerificationCommand(principal.getId(), fullName, idCardNumber,
                idCardFrontMediaId, idCardBackMediaId, selfieWithIdMediaId, null, null, null);
    }
}
