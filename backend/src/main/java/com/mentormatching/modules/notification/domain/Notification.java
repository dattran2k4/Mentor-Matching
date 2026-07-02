package com.mentormatching.modules.notification.domain;

import java.time.LocalDateTime;

public class Notification {

    private final Long id;
    private final Long userId;
    private String title;
    private String message;
    private NotificationType type;
    private boolean read;
    private final LocalDateTime createdAt;

    private Notification(NotificationRestoreData data) {
        this.id = data.id();
        this.userId = data.userId();
        this.title = data.title();
        this.message = data.message();
        this.type = data.type();
        this.read = data.read();
        this.createdAt = data.createdAt();
    }

    public static Notification restore(NotificationRestoreData data) {
        return new Notification(data);
    }

    public static Notification create(Long userId, String title, String message, NotificationType type, LocalDateTime createdAt) {
        return new Notification(new NotificationRestoreData(null, userId, title, message, type, false, createdAt));
    }

    public void markAsRead() {
        this.read = true;
    }

    public void markAsUnread() {
        this.read = false;
    }

    public boolean isUnread() {
        return !read;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getTitle() {
        return title;
    }

    public String getMessage() {
        return message;
    }

    public NotificationType getType() {
        return type;
    }

    public boolean isRead() {
        return read;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
