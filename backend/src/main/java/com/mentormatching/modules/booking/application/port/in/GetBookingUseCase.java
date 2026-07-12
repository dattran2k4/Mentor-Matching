package com.mentormatching.modules.booking.application.port.in;

import java.util.Optional;

import com.mentormatching.modules.booking.domain.Booking;

public interface GetBookingUseCase {

    Optional<Booking> getBooking(Long id);
}
