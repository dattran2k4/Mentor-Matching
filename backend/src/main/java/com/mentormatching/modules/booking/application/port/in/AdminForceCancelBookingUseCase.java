package com.mentormatching.modules.booking.application.port.in;

import com.mentormatching.modules.booking.application.dto.AdminForceCancelBookingCommand;

public interface AdminForceCancelBookingUseCase {

    void forceCancelBooking(AdminForceCancelBookingCommand command);
}
