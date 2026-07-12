package com.mentormatching.modules.notification.application.port.out;

import com.mentormatching.modules.notification.domain.Notification;

public interface NotificationRealtimePort {
    void sendNotification(Notification notification);
}
