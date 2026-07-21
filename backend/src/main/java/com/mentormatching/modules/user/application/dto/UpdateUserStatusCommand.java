package com.mentormatching.modules.user.application.dto;

public record UpdateUserStatusCommand(Long adminUserId, Long userId, UpdateUserStatusAction action) {
}
