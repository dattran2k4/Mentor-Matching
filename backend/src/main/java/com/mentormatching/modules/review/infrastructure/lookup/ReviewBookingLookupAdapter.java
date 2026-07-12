package com.mentormatching.modules.review.infrastructure.lookup;

import java.util.Optional;

import org.springframework.stereotype.Component;

import com.mentormatching.modules.booking.application.port.in.GetBookingUseCase;
import com.mentormatching.modules.booking.domain.Booking;
import com.mentormatching.modules.review.application.port.out.ReviewBookingLookupPort;

@Component
public class ReviewBookingLookupAdapter implements ReviewBookingLookupPort {

    private final GetBookingUseCase getBookingUseCase;

    public ReviewBookingLookupAdapter(GetBookingUseCase getBookingUseCase) {
        this.getBookingUseCase = getBookingUseCase;
    }

    @Override
    public Optional<Booking> getBooking(Long bookingId) {
        return getBookingUseCase.getBooking(bookingId);
    }
}
