package com.mentormatching.modules.notification.application.dto;

import java.time.LocalDateTime;

import com.mentormatching.modules.notification.domain.Notification;
import com.mentormatching.modules.notification.domain.NotificationType;

public record NotificationResponse(
        Long id,
        Long userId,
        String title,
        String message,
        NotificationType type,
        boolean isRead,
        LocalDateTime createdAt
) {
    public static NotificationResponse from(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getUserId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}
