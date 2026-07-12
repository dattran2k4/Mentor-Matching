package com.mentormatching.modules.notification.application.service;

import java.time.LocalDateTime;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mentormatching.modules.notification.application.dto.CreateNotificationCommand;
import com.mentormatching.modules.notification.application.dto.NotificationResponse;
import com.mentormatching.modules.notification.application.port.in.NotificationUseCases;
import com.mentormatching.modules.notification.application.port.out.NotificationRepositoryPort;
import com.mentormatching.modules.notification.application.port.out.NotificationRealtimePort;
import com.mentormatching.modules.notification.domain.Notification;
import com.mentormatching.shared.exception.ResourceNotFoundException;
import com.mentormatching.shared.pagination.PageableUtils;
import com.mentormatching.shared.response.PageResponse;

@Service
@Transactional
public class NotificationService implements NotificationUseCases {

    private final NotificationRepositoryPort notificationRepositoryPort;
    private final NotificationRealtimePort notificationRealtimePort;

    public NotificationService(NotificationRepositoryPort notificationRepositoryPort,
                               NotificationRealtimePort notificationRealtimePort) {
        this.notificationRepositoryPort = notificationRepositoryPort;
        this.notificationRealtimePort = notificationRealtimePort;
    }

    @Override
    public void createNotification(CreateNotificationCommand command) {
        Notification notification = Notification.create(
                command.userId(),
                command.title(),
                command.message(),
                command.type(),
                LocalDateTime.now()
        );
        Notification savedNotification = notificationRepositoryPort.save(notification);
        notificationRealtimePort.sendNotification(savedNotification);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<NotificationResponse> getMyNotifications(Long userId, int page, int size) {
        Pageable pageable = PageableUtils.buildPageable(page, size, "createdAt", "desc", Set.of("createdAt"));
        Page<Notification> notificationPage = notificationRepositoryPort.findByUserId(userId, pageable);
        return PageableUtils.toPageResponse(notificationPage, NotificationResponse::from);
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadNotificationCount(Long userId) {
        return notificationRepositoryPort.countUnreadByUserId(userId);
    }

    @Override
    public void markNotificationAsRead(Long id, Long userId) {
        Notification notification = notificationRepositoryPort.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        
        if (!notification.getUserId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Cannot access this notification");
        }
        
        notification.markAsRead();
        notificationRepositoryPort.save(notification);
    }

    @Override
    public void markAllNotificationsAsRead(Long userId) {
        notificationRepositoryPort.markAllAsReadByUserId(userId);
    }

    @Override
    public void deleteNotification(Long id, Long userId) {
        Notification notification = notificationRepositoryPort.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
                
        if (!notification.getUserId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Cannot delete this notification");
        }
        
        notificationRepositoryPort.deleteById(id);
    }
}
