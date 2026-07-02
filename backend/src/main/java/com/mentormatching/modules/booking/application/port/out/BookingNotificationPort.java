package com.mentormatching.modules.booking.application.port.out;

import com.mentormatching.modules.booking.domain.Booking;

public interface BookingNotificationPort {

    void notifyBookingCreated(Booking booking);

    void notifyBookingConfirmed(Booking booking);

    void notifyBookingCancelled(Booking booking);

    void notifyBookingRejected(Booking booking);

    void notifyBookingCompleted(Booking booking);
}
