package com.mentormatching.modules.review.infrastructure.notification;

import org.springframework.stereotype.Component;

import com.mentormatching.modules.notification.application.dto.CreateNotificationCommand;
import com.mentormatching.modules.notification.application.port.in.NotificationUseCases;
import com.mentormatching.modules.notification.domain.NotificationType;
import com.mentormatching.modules.review.application.port.out.ReviewNotificationPort;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ReviewNotificationAdapter implements ReviewNotificationPort {

    private final NotificationUseCases notificationUseCases;

    @Override
    public void notifyReviewCreated(Long mentorUserId, int rating) {
        String title = "Đánh giá mới từ học viên";
        String message = String.format("Bạn vừa nhận được một đánh giá %d sao từ học viên.", rating);
        
        CreateNotificationCommand command = new CreateNotificationCommand(
                mentorUserId,
                title,
                message,
                NotificationType.REVIEW_CREATED
        );
        
        notificationUseCases.createNotification(command);
    }
}
