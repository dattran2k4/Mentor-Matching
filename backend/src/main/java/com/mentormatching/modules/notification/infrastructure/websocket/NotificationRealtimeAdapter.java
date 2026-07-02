package com.mentormatching.modules.notification.infrastructure.websocket;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.mentormatching.modules.notification.application.dto.NotificationResponse;
import com.mentormatching.modules.notification.application.port.out.NotificationRealtimePort;
import com.mentormatching.modules.notification.domain.Notification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationRealtimeAdapter implements NotificationRealtimePort {

    private final SimpMessagingTemplate simpMessagingTemplate;

    @Override
    public void sendNotification(Notification notification) {
        if (notification == null || notification.getUserId() == null) {
            return;
        }

        try {
            NotificationResponse response = NotificationResponse.from(notification);
            
            // Sending to a specific user. Spring will route it to: /user/{userId}/queue/notifications
            // Note: The Principal's name must match notification.getUserId() as a string.
            simpMessagingTemplate.convertAndSendToUser(
                    String.valueOf(notification.getUserId()), 
                    "/queue/notifications", 
                    response
            );
            log.debug("Sent STOMP notification to user {}", notification.getUserId());
        } catch (Exception e) {
            log.error("Failed to send STOMP notification to user {}", notification.getUserId(), e);
        }
    }
}
