package com.mentormatching.modules.notification.infrastructure.persistence.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mentormatching.modules.notification.infrastructure.persistence.entity.NotificationJpaEntity;

public interface NotificationJpaRepository extends JpaRepository<NotificationJpaEntity, Long> {

    List<NotificationJpaEntity> findByUserIdOrderByCreatedAtDesc(Long userId);

    Page<NotificationJpaEntity> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    List<NotificationJpaEntity> findByUserIdAndReadFalseOrderByCreatedAtDesc(Long userId);

    long countByUserIdAndReadFalse(Long userId);

    @Modifying
    @Query("UPDATE NotificationJpaEntity n SET n.read = true WHERE n.userId = :userId AND n.read = false")
    void markAllAsReadByUserId(@Param("userId") Long userId);
}
