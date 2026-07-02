package com.mentormatching.modules.notification.application.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;

import com.mentormatching.modules.notification.application.dto.CreateNotificationCommand;
import com.mentormatching.modules.notification.application.dto.NotificationResponse;
import com.mentormatching.modules.notification.application.port.out.NotificationRepositoryPort;
import com.mentormatching.modules.notification.application.port.out.NotificationRealtimePort;
import com.mentormatching.modules.notification.domain.Notification;
import com.mentormatching.modules.notification.domain.NotificationRestoreData;
import com.mentormatching.modules.notification.domain.NotificationType;
import com.mentormatching.shared.exception.ResourceNotFoundException;
import com.mentormatching.shared.response.PageResponse;

class NotificationServiceTest {

    private NotificationRepositoryPort notificationRepositoryPort;
    private NotificationRealtimePort notificationRealtimePort;
    private NotificationService notificationService;

    @BeforeEach
    void setUp() {
        notificationRepositoryPort = mock(NotificationRepositoryPort.class);
        notificationRealtimePort = mock(NotificationRealtimePort.class);
        notificationService = new NotificationService(notificationRepositoryPort, notificationRealtimePort);
    }

    @Test
    void createNotificationSavesNotification() {
        CreateNotificationCommand command = new CreateNotificationCommand(
                1L,
                "Test Title",
                "Test Message",
                NotificationType.BOOKING_CREATED
        );

        Notification notification = Notification.restore(new NotificationRestoreData(
                1L, 1L, "Test Title", "Test Message", NotificationType.BOOKING_CREATED, false, LocalDateTime.now()
        ));
        when(notificationRepositoryPort.save(any(Notification.class))).thenReturn(notification);

        notificationService.createNotification(command);

        verify(notificationRepositoryPort).save(any(Notification.class));
        verify(notificationRealtimePort).sendNotification(notification);
    }

    @Test
    void getMyNotificationsReturnsPaginatedNotifications() {
        Notification notification = Notification.restore(new NotificationRestoreData(
                1L, 1L, "Title", "Message", NotificationType.BOOKING_CREATED, false, LocalDateTime.now()
        ));
        Page<Notification> page = new PageImpl<>(List.of(notification));
        when(notificationRepositoryPort.findByUserId(any(Long.class), any(Pageable.class))).thenReturn(page);

        PageResponse<NotificationResponse> response = notificationService.getMyNotifications(1L, 1, 10);

        assertEquals(1, response.getData().size());
        assertEquals("Title", response.getData().get(0).title());
        assertEquals(1, response.getTotalItems());
    }

    @Test
    void getUnreadNotificationCountReturnsCount() {
        when(notificationRepositoryPort.countUnreadByUserId(1L)).thenReturn(5L);

        long count = notificationService.getUnreadNotificationCount(1L);

        assertEquals(5L, count);
        verify(notificationRepositoryPort).countUnreadByUserId(1L);
    }

    @Test
    void markNotificationAsReadSuccess() {
        Notification notification = Notification.restore(new NotificationRestoreData(
                1L, 1L, "Title", "Message", NotificationType.BOOKING_CREATED, false, LocalDateTime.now()
        ));
        when(notificationRepositoryPort.findById(1L)).thenReturn(Optional.of(notification));

        notificationService.markNotificationAsRead(1L, 1L);

        assertTrue(notification.isRead());
        verify(notificationRepositoryPort).save(notification);
    }

    @Test
    void markNotificationAsReadThrowsWhenNotFound() {
        when(notificationRepositoryPort.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> 
            notificationService.markNotificationAsRead(1L, 1L)
        );
    }

    @Test
    void markNotificationAsReadThrowsWhenAccessDenied() {
        Notification notification = Notification.restore(new NotificationRestoreData(
                1L, 2L, "Title", "Message", NotificationType.BOOKING_CREATED, false, LocalDateTime.now()
        ));
        when(notificationRepositoryPort.findById(1L)).thenReturn(Optional.of(notification));

        assertThrows(AccessDeniedException.class, () -> 
            notificationService.markNotificationAsRead(1L, 1L)
        );
    }

    @Test
    void markAllNotificationsAsReadCallsPort() {
        notificationService.markAllNotificationsAsRead(1L);

        verify(notificationRepositoryPort).markAllAsReadByUserId(1L);
    }

    @Test
    void deleteNotificationSuccess() {
        Notification notification = Notification.restore(new NotificationRestoreData(
                1L, 1L, "Title", "Message", NotificationType.BOOKING_CREATED, false, LocalDateTime.now()
        ));
        when(notificationRepositoryPort.findById(1L)).thenReturn(Optional.of(notification));

        notificationService.deleteNotification(1L, 1L);

        verify(notificationRepositoryPort).deleteById(1L);
    }

    @Test
    void deleteNotificationThrowsWhenNotFound() {
        when(notificationRepositoryPort.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> 
            notificationService.deleteNotification(1L, 1L)
        );
    }

    @Test
    void deleteNotificationThrowsWhenAccessDenied() {
        Notification notification = Notification.restore(new NotificationRestoreData(
                1L, 2L, "Title", "Message", NotificationType.BOOKING_CREATED, false, LocalDateTime.now()
        ));
        when(notificationRepositoryPort.findById(1L)).thenReturn(Optional.of(notification));

        assertThrows(AccessDeniedException.class, () -> 
            notificationService.deleteNotification(1L, 1L)
        );
    }
}
