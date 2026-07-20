package com.mentormatching.modules.booking.application.dto;

public record AdminForceCancelBookingCommand(Long adminUserId, Long bookingId, String cancelReason) {
}
