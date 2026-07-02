package com.mentormatching.modules.booking.application.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.mentormatching.modules.booking.application.dto.BookingMentorSnapshot;
import com.mentormatching.modules.booking.application.dto.BookingScheduleBlock;
import com.mentormatching.modules.booking.application.dto.RejectBookingByMentorCommand;
import com.mentormatching.modules.booking.application.port.out.BookingAvailabilityLookupPort;
import com.mentormatching.modules.booking.application.port.out.BookingMentorLookupPort;
import com.mentormatching.modules.booking.application.port.out.BookingMentorSubjectLookupPort;
import com.mentormatching.modules.booking.application.port.out.BookingNotificationPort;
import com.mentormatching.modules.booking.application.port.out.BookingRepositoryPort;
import com.mentormatching.modules.booking.application.port.out.BookingUserLookupPort;
import com.mentormatching.modules.booking.domain.Booking;
import com.mentormatching.modules.booking.domain.BookingMeetingType;
import com.mentormatching.modules.booking.domain.BookingRestoreData;
import com.mentormatching.modules.booking.domain.BookingStatus;
import com.mentormatching.modules.mentor.domain.MeetingType;
import com.mentormatching.modules.payment.application.port.out.PaymentRepositoryPort;
import com.mentormatching.modules.payment.domain.Payment;
import com.mentormatching.modules.payment.domain.PaymentMethod;
import com.mentormatching.modules.payment.domain.PaymentProvider;
import com.mentormatching.modules.payment.domain.PaymentRestoreData;
import com.mentormatching.modules.payment.domain.PaymentStatus;
import com.mentormatching.shared.exception.InvalidDataException;
import com.mentormatching.shared.exception.ResourceNotFoundException;

class BookingServiceTest {

    private BookingRepositoryPort bookingRepositoryPort;
    private BookingUserLookupPort bookingUserLookupPort;
    private BookingMentorLookupPort bookingMentorLookupPort;
    private BookingMentorSubjectLookupPort bookingMentorSubjectLookupPort;
    private BookingAvailabilityLookupPort bookingAvailabilityLookupPort;
    private PaymentRepositoryPort paymentRepositoryPort;
    private BookingNotificationPort bookingNotificationPort;
    private BookingService bookingService;

    @BeforeEach
    void setUp() {
        bookingRepositoryPort = mock(BookingRepositoryPort.class);
        bookingUserLookupPort = mock(BookingUserLookupPort.class);
        bookingMentorLookupPort = mock(BookingMentorLookupPort.class);
        bookingMentorSubjectLookupPort = mock(BookingMentorSubjectLookupPort.class);
        bookingAvailabilityLookupPort = mock(BookingAvailabilityLookupPort.class);
        paymentRepositoryPort = mock(PaymentRepositoryPort.class);
        bookingNotificationPort = mock(BookingNotificationPort.class);
        bookingService = new BookingService(bookingRepositoryPort, bookingUserLookupPort, bookingMentorLookupPort,
                bookingMentorSubjectLookupPort, bookingAvailabilityLookupPort, paymentRepositoryPort,
                bookingNotificationPort);
    }

    @Test
    void rejectBookingByMentorRejectsPendingBookingWhenOwnedAndNotPaid() {
        RejectBookingByMentorCommand command = new RejectBookingByMentorCommand(20L, 100L,
                "  Mentor is not available on selected schedule  ");
        Booking booking = pendingBooking(10L);

        when(bookingMentorLookupPort.getMentorSnapshotByUserId(20L)).thenReturn(new BookingMentorSnapshot(10L, 20L,
                "Mentor A", MeetingType.HYBRID));
        when(bookingRepositoryPort.findById(100L)).thenReturn(Optional.of(booking));
        when(paymentRepositoryPort.findByBookingId(100L)).thenReturn(Optional.empty());
        when(bookingRepositoryPort.save(booking)).thenReturn(booking);

        bookingService.rejectBookingByMentor(command);

        assertEquals(BookingStatus.REJECTED, booking.getStatus());
        assertEquals(20L, booking.getCancelledBy());
        assertEquals("Mentor is not available on selected schedule", booking.getCancelReason());
        verify(bookingRepositoryPort).save(booking);
    }

    @Test
    void rejectBookingByMentorThrowsWhenBookingDoesNotBelongToMentor() {
        RejectBookingByMentorCommand command = new RejectBookingByMentorCommand(20L, 100L, "Reason");
        Booking booking = pendingBooking(99L);

        when(bookingMentorLookupPort.getMentorSnapshotByUserId(20L)).thenReturn(new BookingMentorSnapshot(10L, 20L,
                "Mentor A", MeetingType.HYBRID));
        when(bookingRepositoryPort.findById(100L)).thenReturn(Optional.of(booking));

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> bookingService.rejectBookingByMentor(command));

        assertEquals("Booking not found", exception.getMessage());
        verify(bookingRepositoryPort, never()).save(booking);
    }

    @Test
    void rejectBookingByMentorThrowsWhenPaymentIsPaid() {
        RejectBookingByMentorCommand command = new RejectBookingByMentorCommand(20L, 100L, "Reason");
        Booking booking = pendingBooking(10L);
        Payment payment = paidPayment(100L);

        when(bookingMentorLookupPort.getMentorSnapshotByUserId(20L)).thenReturn(new BookingMentorSnapshot(10L, 20L,
                "Mentor A", MeetingType.HYBRID));
        when(bookingRepositoryPort.findById(100L)).thenReturn(Optional.of(booking));
        when(paymentRepositoryPort.findByBookingId(100L)).thenReturn(Optional.of(payment));

        InvalidDataException exception = assertThrows(InvalidDataException.class,
                () -> bookingService.rejectBookingByMentor(command));

        assertEquals("Paid booking cannot be rejected", exception.getMessage());
        verify(bookingRepositoryPort, never()).save(booking);
    }

    @Test
    void rejectBookingByMentorThrowsWhenBookingIsNotPending() {
        RejectBookingByMentorCommand command = new RejectBookingByMentorCommand(20L, 100L, "Reason");
        Booking booking = rejectedBooking(10L);

        when(bookingMentorLookupPort.getMentorSnapshotByUserId(20L)).thenReturn(new BookingMentorSnapshot(10L, 20L,
                "Mentor A", MeetingType.HYBRID));
        when(bookingRepositoryPort.findById(100L)).thenReturn(Optional.of(booking));
        when(paymentRepositoryPort.findByBookingId(100L)).thenReturn(Optional.empty());

        InvalidDataException exception = assertThrows(InvalidDataException.class,
                () -> bookingService.rejectBookingByMentor(command));

        assertEquals("Only pending booking can be rejected", exception.getMessage());
        verify(bookingRepositoryPort, never()).save(booking);
    }

    @Test
    void completeBookingByMentorCompletesConfirmedBookingAfterSessionEnd() {
        Booking booking = confirmedPastBooking(10L);

        when(bookingMentorLookupPort.getMentorSnapshotByUserId(20L)).thenReturn(new BookingMentorSnapshot(10L, 20L,
                "Mentor A", MeetingType.HYBRID));
        when(bookingRepositoryPort.findById(100L)).thenReturn(Optional.of(booking));
        when(bookingRepositoryPort.save(booking)).thenReturn(booking);

        bookingService.completeBookingByMentor(20L, 100L);

        assertEquals(BookingStatus.COMPLETED, booking.getStatus());
        verify(bookingRepositoryPort).save(booking);
    }

    @Test
    void completeBookingByMentorThrowsWhenBookingDoesNotBelongToMentor() {
        Booking booking = confirmedPastBooking(99L);

        when(bookingMentorLookupPort.getMentorSnapshotByUserId(20L)).thenReturn(new BookingMentorSnapshot(10L, 20L,
                "Mentor A", MeetingType.HYBRID));
        when(bookingRepositoryPort.findById(100L)).thenReturn(Optional.of(booking));

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> bookingService.completeBookingByMentor(20L, 100L));

        assertEquals("Booking not found", exception.getMessage());
        verify(bookingRepositoryPort, never()).save(booking);
    }

    @Test
    void completeBookingByMentorThrowsWhenBookingIsNotConfirmed() {
        Booking booking = pendingPastBooking(10L);

        when(bookingMentorLookupPort.getMentorSnapshotByUserId(20L)).thenReturn(new BookingMentorSnapshot(10L, 20L,
                "Mentor A", MeetingType.HYBRID));
        when(bookingRepositoryPort.findById(100L)).thenReturn(Optional.of(booking));

        InvalidDataException exception = assertThrows(InvalidDataException.class,
                () -> bookingService.completeBookingByMentor(20L, 100L));

        assertEquals("Only confirmed booking can be completed", exception.getMessage());
        verify(bookingRepositoryPort, never()).save(booking);
    }

    @Test
    void completeBookingByMentorThrowsWhenSessionHasNotEndedYet() {
        Booking booking = confirmedFutureBooking(10L);

        when(bookingMentorLookupPort.getMentorSnapshotByUserId(20L)).thenReturn(new BookingMentorSnapshot(10L, 20L,
                "Mentor A", MeetingType.HYBRID));
        when(bookingRepositoryPort.findById(100L)).thenReturn(Optional.of(booking));

        InvalidDataException exception = assertThrows(InvalidDataException.class,
                () -> bookingService.completeBookingByMentor(20L, 100L));

        assertEquals("Booking can only be completed after the session end time", exception.getMessage());
        verify(bookingRepositoryPort, never()).save(booking);
    }

    @Test
    void getMentorScheduleBlocksReturnsPendingAndConfirmedBookingWindows() {
        LocalDate from = LocalDate.of(2026, 6, 15);
        LocalDate to = LocalDate.of(2026, 6, 21);
        Booking pending = pendingBooking(10L);
        Booking confirmed = confirmedFutureBooking(10L);
        when(bookingRepositoryPort.findScheduleBlockingBookings(10L, from, to,
                List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED)))
                .thenReturn(List.of(pending, confirmed));

        List<BookingScheduleBlock> result = bookingService.getMentorScheduleBlocks(10L, from, to);

        assertEquals(List.of(
                new BookingScheduleBlock(pending.getBookingDate(), pending.getStartTime(), pending.getEndTime()),
                new BookingScheduleBlock(confirmed.getBookingDate(), confirmed.getStartTime(),
                        confirmed.getEndTime())), result);
    }

    private Booking pendingBooking(Long mentorId) {
        return Booking.restore(new BookingRestoreData(100L, 30L, "Student A", mentorId, "Mentor A", 200L, "Math",
                "Grade 9", LocalDate.now().plusDays(2), LocalTime.of(9, 0), LocalTime.of(10, 0),
                new BigDecimal("250000"), new BigDecimal("250000"), BookingMeetingType.ONLINE, null, null,
                BookingStatus.PENDING, "Need help", null, null, LocalDateTime.parse("2026-06-12T10:00:00"),
                LocalDateTime.parse("2026-06-12T10:00:00")));
    }

    private Booking rejectedBooking(Long mentorId) {
        return Booking.restore(new BookingRestoreData(100L, 30L, "Student A", mentorId, "Mentor A", 200L, "Math",
                "Grade 9", LocalDate.now().plusDays(2), LocalTime.of(9, 0), LocalTime.of(10, 0),
                new BigDecimal("250000"), new BigDecimal("250000"), BookingMeetingType.ONLINE, null, null,
                BookingStatus.REJECTED, "Need help", 20L, "Already rejected",
                LocalDateTime.parse("2026-06-12T10:00:00"), LocalDateTime.parse("2026-06-12T11:00:00")));
    }

    private Booking confirmedPastBooking(Long mentorId) {
        return Booking.restore(new BookingRestoreData(100L, 30L, "Student A", mentorId, "Mentor A", 200L, "Math",
                "Grade 9", LocalDate.now().minusDays(1), LocalTime.of(9, 0), LocalTime.of(10, 0),
                new BigDecimal("250000"), new BigDecimal("250000"), BookingMeetingType.ONLINE, null, null,
                BookingStatus.CONFIRMED, "Need help", null, null, LocalDateTime.parse("2026-06-12T10:00:00"),
                LocalDateTime.parse("2026-06-12T10:00:00")));
    }

    private Booking pendingPastBooking(Long mentorId) {
        return Booking.restore(new BookingRestoreData(100L, 30L, "Student A", mentorId, "Mentor A", 200L, "Math",
                "Grade 9", LocalDate.now().minusDays(1), LocalTime.of(9, 0), LocalTime.of(10, 0),
                new BigDecimal("250000"), new BigDecimal("250000"), BookingMeetingType.ONLINE, null, null,
                BookingStatus.PENDING, "Need help", null, null, LocalDateTime.parse("2026-06-12T10:00:00"),
                LocalDateTime.parse("2026-06-12T10:00:00")));
    }

    private Booking confirmedFutureBooking(Long mentorId) {
        return Booking.restore(new BookingRestoreData(100L, 30L, "Student A", mentorId, "Mentor A", 200L, "Math",
                "Grade 9", LocalDate.now().plusDays(1), LocalTime.of(9, 0), LocalTime.of(10, 0),
                new BigDecimal("250000"), new BigDecimal("250000"), BookingMeetingType.ONLINE, null, null,
                BookingStatus.CONFIRMED, "Need help", null, null, LocalDateTime.parse("2026-06-12T10:00:00"),
                LocalDateTime.parse("2026-06-12T10:00:00")));
    }

    private Payment paidPayment(Long bookingId) {
        return Payment.restore(new PaymentRestoreData(500L, bookingId, 30L, new BigDecimal("250000"),
                PaymentMethod.GATEWAY, PaymentProvider.STRIPE, PaymentStatus.PAID,
                LocalDateTime.parse("2026-06-12T10:30:00"), "ref_123", "txn_123", "https://checkout.example.com",
                LocalDateTime.parse("2026-06-12T11:30:00"), null, LocalDateTime.parse("2026-06-12T10:00:00"),
                LocalDateTime.parse("2026-06-12T10:30:00")));
    }
}
