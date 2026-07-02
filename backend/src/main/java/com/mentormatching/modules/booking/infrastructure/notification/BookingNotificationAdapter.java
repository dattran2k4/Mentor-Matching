package com.mentormatching.modules.booking.infrastructure.notification;

import org.springframework.stereotype.Component;

import com.mentormatching.modules.booking.application.port.out.BookingMentorLookupPort;
import com.mentormatching.modules.booking.application.port.out.BookingNotificationPort;
import com.mentormatching.modules.booking.domain.Booking;
import com.mentormatching.modules.notification.application.dto.CreateNotificationCommand;
import com.mentormatching.modules.notification.application.port.in.NotificationUseCases;
import com.mentormatching.modules.notification.domain.NotificationType;

@Component
public class BookingNotificationAdapter implements BookingNotificationPort {

    private final NotificationUseCases notificationUseCases;
    private final BookingMentorLookupPort bookingMentorLookupPort;

    public BookingNotificationAdapter(NotificationUseCases notificationUseCases, BookingMentorLookupPort bookingMentorLookupPort) {
        this.notificationUseCases = notificationUseCases;
        this.bookingMentorLookupPort = bookingMentorLookupPort;
    }

    @Override
    public void notifyBookingCreated(Booking booking) {
        Long mentorUserId = bookingMentorLookupPort.getMentorSnapshot(booking.getMentorId()).userId();
        // Notify Mentor
        notificationUseCases.createNotification(new CreateNotificationCommand(
                mentorUserId,
                "New Booking Request",
                "You have a new booking request from " + booking.getStudentName() + " for " + booking.getSubjectName(),
                NotificationType.BOOKING_CREATED
        ));
    }

    @Override
    public void notifyBookingConfirmed(Booking booking) {
        // Notify Student
        notificationUseCases.createNotification(new CreateNotificationCommand(
                booking.getStudentUserId(),
                "Booking Confirmed",
                "Your booking with " + booking.getMentorName() + " has been confirmed.",
                NotificationType.BOOKING_CONFIRMED
        ));
    }

    @Override
    public void notifyBookingCancelled(Booking booking) {
        // Can be either mentor or student, let's notify the other party.
        // For simplicity, we can notify both or just the one who didn't cancel.
        // Assuming we notify both or just one for now.
        notificationUseCases.createNotification(new CreateNotificationCommand(
                booking.getStudentUserId(),
                "Booking Cancelled",
                "Your booking with " + booking.getMentorName() + " has been cancelled.",
                NotificationType.BOOKING_CANCELLED
        ));
    }

    @Override
    public void notifyBookingRejected(Booking booking) {
        // Notify Student
        notificationUseCases.createNotification(new CreateNotificationCommand(
                booking.getStudentUserId(),
                "Booking Rejected",
                "Your booking request with " + booking.getMentorName() + " was rejected.",
                NotificationType.BOOKING_REJECTED
        ));
    }

    @Override
    public void notifyBookingCompleted(Booking booking) {
        // Notify Student
        notificationUseCases.createNotification(new CreateNotificationCommand(
                booking.getStudentUserId(),
                "Booking Completed",
                "Your session with " + booking.getMentorName() + " is completed.",
                NotificationType.BOOKING_COMPLETED // Assuming there is a SYSTEM or BOOKING_COMPLETED if not, maybe add it to NotificationType?
        ));
    }
}
