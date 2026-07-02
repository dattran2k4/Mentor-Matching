package com.mentormatching.modules.notification.infrastructure.persistence;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import com.mentormatching.modules.notification.application.port.out.NotificationRepositoryPort;
import com.mentormatching.modules.notification.domain.Notification;
import com.mentormatching.modules.notification.infrastructure.persistence.mapper.NotificationPersistenceMapper;
import com.mentormatching.modules.notification.infrastructure.persistence.repository.NotificationJpaRepository;

@Component
public class NotificationPersistenceAdapter implements NotificationRepositoryPort {

    private final NotificationJpaRepository notificationJpaRepository;
    private final NotificationPersistenceMapper notificationPersistenceMapper;

    public NotificationPersistenceAdapter(NotificationJpaRepository notificationJpaRepository,
                                          NotificationPersistenceMapper notificationPersistenceMapper) {
        this.notificationJpaRepository = notificationJpaRepository;
        this.notificationPersistenceMapper = notificationPersistenceMapper;
    }

    @Override
    public Notification save(Notification notification) {
        return notificationPersistenceMapper.toDomain(notificationJpaRepository.save(
                notificationPersistenceMapper.toEntity(notification)));
    }

    @Override
    public Optional<Notification> findById(Long id) {
        return notificationJpaRepository.findById(id).map(notificationPersistenceMapper::toDomain);
    }

    @Override
    public List<Notification> findByUserId(Long userId) {
        return notificationJpaRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(notificationPersistenceMapper::toDomain)
                .toList();
    }

    @Override
    public List<Notification> findUnreadByUserId(Long userId) {
        return notificationJpaRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId).stream()
                .map(notificationPersistenceMapper::toDomain)
                .toList();
    }

    @Override
    public Page<Notification> findByUserId(Long userId, Pageable pageable) {
        return notificationJpaRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(notificationPersistenceMapper::toDomain);
    }

    @Override
    public long countUnreadByUserId(Long userId) {
        return notificationJpaRepository.countByUserIdAndReadFalse(userId);
    }

    @Override
    public void deleteById(Long id) {
        notificationJpaRepository.deleteById(id);
    }

    @Override
    public void markAllAsReadByUserId(Long userId) {
        notificationJpaRepository.markAllAsReadByUserId(userId);
    }
}
