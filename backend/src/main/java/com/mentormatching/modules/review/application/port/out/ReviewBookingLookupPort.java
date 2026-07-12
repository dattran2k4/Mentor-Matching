package com.mentormatching.modules.review.application.port.out;

import java.util.Optional;

import com.mentormatching.modules.booking.domain.Booking;

public interface ReviewBookingLookupPort {

    Optional<Booking> getBooking(Long bookingId);
}
