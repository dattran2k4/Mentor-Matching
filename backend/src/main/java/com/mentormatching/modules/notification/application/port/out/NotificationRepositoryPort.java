package com.mentormatching.modules.notification.application.port.out;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.mentormatching.modules.notification.domain.Notification;

public interface NotificationRepositoryPort {

    Notification save(Notification notification);

    Optional<Notification> findById(Long id);

    List<Notification> findByUserId(Long userId);

    Page<Notification> findByUserId(Long userId, Pageable pageable);

    List<Notification> findUnreadByUserId(Long userId);

    long countUnreadByUserId(Long userId);

    void deleteById(Long id);

    void markAllAsReadByUserId(Long userId);
}
