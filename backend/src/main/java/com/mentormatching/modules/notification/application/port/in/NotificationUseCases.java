package com.mentormatching.modules.notification.application.port.in;

import com.mentormatching.modules.notification.application.dto.CreateNotificationCommand;
import com.mentormatching.modules.notification.application.dto.NotificationResponse;
import com.mentormatching.shared.response.PageResponse;

public interface NotificationUseCases {

    void createNotification(CreateNotificationCommand command);

    PageResponse<NotificationResponse> getMyNotifications(Long userId, int page, int size);

    long getUnreadNotificationCount(Long userId);

    void markNotificationAsRead(Long id, Long userId);

    void markAllNotificationsAsRead(Long userId);

    void deleteNotification(Long id, Long userId);
}
