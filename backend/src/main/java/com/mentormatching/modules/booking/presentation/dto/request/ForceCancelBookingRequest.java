package com.mentormatching.modules.booking.presentation.dto.request;

import com.mentormatching.modules.booking.application.dto.AdminForceCancelBookingCommand;
import com.mentormatching.shared.security.model.AuthenticatedPrincipal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ForceCancelBookingRequest(
        @NotBlank(message = "Cancel reason is required")
        @Size(max = 1000, message = "Cancel reason must not exceed 1000 characters")
        String cancelReason
) {

    public AdminForceCancelBookingCommand toCommand(AuthenticatedPrincipal principal, Long bookingId) {
        return new AdminForceCancelBookingCommand(principal.getId(), bookingId, cancelReason);
    }
}
