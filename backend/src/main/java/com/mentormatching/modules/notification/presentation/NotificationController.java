package com.mentormatching.modules.notification.presentation;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mentormatching.modules.notification.application.dto.NotificationResponse;
import com.mentormatching.modules.notification.application.port.in.NotificationUseCases;
import com.mentormatching.shared.response.ApiResponse;
import com.mentormatching.shared.response.ApiResponseFactory;
import com.mentormatching.shared.response.PageResponse;
import com.mentormatching.shared.security.model.AuthenticatedPrincipal;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/notifications")
@Tag(name = "Notification", description = "Notification Management APIs")
public class NotificationController {

    private final NotificationUseCases notificationUseCases;
    private final ApiResponseFactory apiResponseFactory;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get my notifications", description = "Get paginated list of current user's notifications")
    public ApiResponse<PageResponse<NotificationResponse>> getMyNotifications(
            @AuthenticationPrincipal AuthenticatedPrincipal principal,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponse<NotificationResponse> response = notificationUseCases.getMyNotifications(principal.getId(), page, size);
        return apiResponseFactory.success(response, "Get notifications successfully");
    }

    @GetMapping("/unread-count")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get unread notification count", description = "Get the number of unread notifications for the current user")
    public ApiResponse<Long> getUnreadCount(@AuthenticationPrincipal AuthenticatedPrincipal principal) {
        long count = notificationUseCases.getUnreadNotificationCount(principal.getId());
        return apiResponseFactory.success(count, "Get unread count successfully");
    }

    @PatchMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Mark notification as read", description = "Mark a specific notification as read")
    public ApiResponse<Void> markAsRead(
            @AuthenticationPrincipal AuthenticatedPrincipal principal,
            @PathVariable Long id) {
        notificationUseCases.markNotificationAsRead(id, principal.getId());
        return apiResponseFactory.success(null, "Notification marked as read");
    }

    @PostMapping("/mark-all-read")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Mark all notifications as read", description = "Mark all notifications of the current user as read")
    public ApiResponse<Void> markAllAsRead(@AuthenticationPrincipal AuthenticatedPrincipal principal) {
        notificationUseCases.markAllNotificationsAsRead(principal.getId());
        return apiResponseFactory.success(null, "All notifications marked as read");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Delete a notification", description = "Delete a specific notification from the list")
    public ApiResponse<Void> deleteNotification(
            @AuthenticationPrincipal AuthenticatedPrincipal principal,
            @PathVariable Long id) {
        notificationUseCases.deleteNotification(id, principal.getId());
        return apiResponseFactory.success(null, "Notification deleted");
    }
}
