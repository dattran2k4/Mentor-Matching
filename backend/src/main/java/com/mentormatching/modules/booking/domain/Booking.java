package com.mentormatching.modules.booking.domain;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.mentormatching.shared.exception.InvalidDataException;

public class Booking {

    private static final int MAX_NOTE_LENGTH = 1000;

    private final Long id;
    private final Long studentUserId;
    private final String studentName;
    private final Long mentorId;
    private final String mentorName;
    private final Long mentorSubjectId;
    private final String subjectName;
    private final String gradeName;
    private final LocalDate bookingDate;
    private final LocalTime startTime;
    private final LocalTime endTime;
    private final BigDecimal pricePerHour;
    private final BigDecimal totalAmount;
    private BookingMeetingType meetingType;
    private String meetingLink;
    private String meetingAddress;
    private BookingStatus status;
    private String note;
    private Long cancelledBy;
    private String cancelReason;
    private final LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Booking(BookingRestoreData data) {
        this.id = data.id();
        this.studentUserId = data.studentUserId();
        this.studentName = data.studentName();
        this.mentorId = data.mentorId();
        this.mentorName = data.mentorName();
        this.mentorSubjectId = data.mentorSubjectId();
        this.subjectName = data.subjectName();
        this.gradeName = data.gradeName();
        this.bookingDate = data.bookingDate();
        this.startTime = data.startTime();
        this.endTime = data.endTime();
        this.pricePerHour = data.pricePerHour();
        this.totalAmount = data.totalAmount();
        this.meetingType = data.meetingType();
        this.meetingLink = data.meetingLink();
        this.meetingAddress = data.meetingAddress();
        this.status = data.status();
        this.note = data.note();
        this.cancelledBy = data.cancelledBy();
        this.cancelReason = data.cancelReason();
        this.createdAt = data.createdAt();
        this.updatedAt = data.updatedAt();
    }

    public static Booking restore(BookingRestoreData data) {
        return new Booking(data);
    }

    public static Booking create(BookingCreateData data) {
        validateCreateData(data);
        LocalDateTime now = LocalDateTime.now();
        BigDecimal totalAmount = calculateTotalAmount(data.pricePerHour(), data.startTime(), data.endTime());

        return new Booking(new BookingRestoreData(null, data.studentUserId(), data.studentName(), data.mentorId(),
                data.mentorName(), data.mentorSubjectId(), data.subjectName(), data.gradeName(),
                data.bookingDate(), data.startTime(), data.endTime(), data.pricePerHour(), totalAmount,
                data.meetingType(), null, null, BookingStatus.PENDING, data.note(), null, null, now, now));
    }

    public void confirm() {
        if (status == BookingStatus.CONFIRMED) {
            return;
        }
        if (status != BookingStatus.PENDING) {
            throw new InvalidDataException("Only pending booking can be confirmed");
        }
        this.status = BookingStatus.CONFIRMED;
        touch();
    }

    public void reject(Long mentorUserId, String cancelReason) {
        if (status != BookingStatus.PENDING) {
            throw new InvalidDataException("Only pending booking can be rejected");
        }
        if (mentorUserId == null) {
            throw new InvalidDataException("Mentor user id is required when rejecting booking");
        }
        if (cancelReason == null || cancelReason.isBlank()) {
            throw new InvalidDataException("Cancel reason is required when rejecting booking");
        }
        this.status = BookingStatus.REJECTED;
        this.cancelledBy = mentorUserId;
        this.cancelReason = cancelReason.trim();
        touch();
    }

    public void complete(LocalDateTime currentTime) {
        requireNotNull(currentTime, "Current time is required when completing booking");
        if (status != BookingStatus.CONFIRMED) {
            throw new InvalidDataException("Only confirmed booking can be completed");
        }
        LocalDateTime bookingEndAt = LocalDateTime.of(bookingDate, endTime);
        if (!currentTime.isAfter(bookingEndAt)) {
            throw new InvalidDataException("Booking can only be completed after the session end time");
        }
        this.status = BookingStatus.COMPLETED;
        touch();
    }

    public void forceCancel(Long adminUserId, String cancelReason) {
        if (status == BookingStatus.COMPLETED || status == BookingStatus.CANCELLED
                || status == BookingStatus.REJECTED) {
            throw new InvalidDataException("Booking in status " + status + " cannot be force cancelled");
        }
        if (adminUserId == null) {
            throw new InvalidDataException("Admin user id is required when force cancelling booking");
        }
        if (cancelReason == null || cancelReason.isBlank()) {
            throw new InvalidDataException("Cancel reason is required when force cancelling booking");
        }
        this.status = BookingStatus.CANCELLED;
        this.cancelledBy = adminUserId;
        this.cancelReason = cancelReason.trim();
        touch();
    }

    public Long getId() {
        return id;
    }

    public Long getStudentUserId() {
        return studentUserId;
    }

    public String getStudentName() {
        return studentName;
    }

    public Long getMentorId() {
        return mentorId;
    }

    public String getMentorName() {
        return mentorName;
    }

    public Long getMentorSubjectId() {
        return mentorSubjectId;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public String getGradeName() {
        return gradeName;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public BigDecimal getPricePerHour() {
        return pricePerHour;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public BookingMeetingType getMeetingType() {
        return meetingType;
    }

    public String getMeetingLink() {
        return meetingLink;
    }

    public String getMeetingAddress() {
        return meetingAddress;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public String getNote() {
        return note;
    }

    public Long getCancelledBy() {
        return cancelledBy;
    }

    public String getCancelReason() {
        return cancelReason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    private static void validateCreateData(BookingCreateData data) {
        requireNotNull(data, "Booking create data must not be null");
        requireNotNull(data.studentUserId(), "Student user id is required");
        requireNotNull(data.mentorId(), "Mentor id is required");
        requireNotNull(data.mentorSubjectId(), "Mentor subject id is required");
        requireNotNull(data.bookingDate(), "Booking date is required");
        requireNotNull(data.startTime(), "Booking start time is required");
        requireNotNull(data.endTime(), "Booking end time is required");
        requireNotNull(data.pricePerHour(), "Price per hour is required");
        requireNotNull(data.meetingType(), "Meeting type is required");
        validateBookingTime(data.bookingDate(), data.startTime(), data.endTime());
        validateAmount(data.pricePerHour());
        validateNote(data.note());
    }

    private static void validateBookingTime(LocalDate bookingDate, LocalTime startTime, LocalTime endTime) {
        if (!endTime.isAfter(startTime)) {
            throw new InvalidDataException("Booking end time must be after start time");
        }

        LocalDateTime bookingStartAt = LocalDateTime.of(bookingDate, startTime);
        if (!bookingStartAt.isAfter(LocalDateTime.now())) {
            throw new InvalidDataException("Booking time must be in the future");
        }
    }

    private static void validateAmount(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidDataException("Price per hour must be positive");
        }
    }

    private static BigDecimal calculateTotalAmount(BigDecimal pricePerHour, LocalTime startTime, LocalTime endTime) {
        long durationMinutes = Duration.between(startTime, endTime).toMinutes();
        return pricePerHour.multiply(BigDecimal.valueOf(durationMinutes))
                .divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);
    }

    private static void validateNote(String note) {
        if (note != null && note.length() > MAX_NOTE_LENGTH) {
            throw new InvalidDataException("Booking note must not exceed " + MAX_NOTE_LENGTH + " characters");
        }
    }

    private static void requireNotNull(Object value, String message) {
        if (value == null) {
            throw new InvalidDataException(message);
        }
    }

    private void touch() {
        updatedAt = LocalDateTime.now();
    }
}
