package com.mentormatching.modules.mentor.presentation.dto.request;

import com.mentormatching.modules.mentor.application.dto.UpdateCurrentMentorAvatarCommand;
import com.mentormatching.shared.security.model.AuthenticatedPrincipal;

import jakarta.validation.constraints.NotNull;

public record UpdateCurrentMentorAvatarRequest(@NotNull(message = "Avatar media id is required") Long avatarMediaId) {

    public UpdateCurrentMentorAvatarCommand toCommand(AuthenticatedPrincipal principal) {
        return new UpdateCurrentMentorAvatarCommand(principal.getId(), avatarMediaId);
    }
}
