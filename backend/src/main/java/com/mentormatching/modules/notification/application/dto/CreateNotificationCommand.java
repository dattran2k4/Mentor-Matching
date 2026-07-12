package com.mentormatching.modules.notification.application.dto;

import com.mentormatching.modules.notification.domain.NotificationType;

public record CreateNotificationCommand(
        Long userId,
        String title,
        String message,
        NotificationType type
) {
}
