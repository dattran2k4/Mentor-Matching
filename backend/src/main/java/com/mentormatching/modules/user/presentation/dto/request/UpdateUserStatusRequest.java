package com.mentormatching.modules.user.presentation.dto.request;

import com.mentormatching.modules.user.application.dto.UpdateUserStatusAction;
import com.mentormatching.modules.user.application.dto.UpdateUserStatusCommand;
import com.mentormatching.shared.security.model.AuthenticatedPrincipal;

import jakarta.validation.constraints.NotNull;

public record UpdateUserStatusRequest(
        @NotNull(message = "Action is required") UpdateUserStatusAction action
) {

    public UpdateUserStatusCommand toCommand(AuthenticatedPrincipal principal, Long userId) {
        return new UpdateUserStatusCommand(principal.getId(), userId, action);
    }
}
