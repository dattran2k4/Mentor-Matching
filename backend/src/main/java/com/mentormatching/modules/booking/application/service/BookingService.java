package com.mentormatching.modules.booking.application.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mentormatching.modules.booking.application.dto.BookingMentorSubjectSnapshot;
import com.mentormatching.modules.booking.application.dto.BookingPaymentSummary;
import com.mentormatching.modules.booking.application.dto.BookingScheduleBlock;
import com.mentormatching.modules.booking.application.dto.BookingMentorSnapshot;
import com.mentormatching.modules.booking.application.dto.RejectBookingByMentorCommand;
import com.mentormatching.modules.booking.application.dto.BookingUserSnapshot;
import com.mentormatching.modules.booking.application.dto.CreateBookingCommand;
import com.mentormatching.modules.booking.application.dto.GetBookingsQuery;
import com.mentormatching.modules.booking.application.dto.GetMentorBookingsQuery;
import com.mentormatching.modules.booking.application.dto.GetMyBookingsQuery;
import com.mentormatching.modules.booking.application.port.in.CompleteBookingByMentorUseCase;
import com.mentormatching.modules.booking.application.port.in.CreateBookingUseCase;
import com.mentormatching.modules.booking.application.port.in.GetBookingPaymentSummaryUseCase;
import com.mentormatching.modules.booking.application.port.in.GetBookingsUseCase;
import com.mentormatching.modules.booking.application.port.in.GetBookingUseCase;
import com.mentormatching.modules.booking.application.port.in.GetMentorBookingsUseCase;
import com.mentormatching.modules.booking.application.port.in.GetMentorScheduleBlocksUseCase;
import com.mentormatching.modules.booking.application.port.in.GetMyBookingsUseCase;
import com.mentormatching.modules.booking.application.port.in.RejectBookingByMentorUseCase;
import com.mentormatching.modules.booking.application.port.out.BookingAvailabilityLookupPort;
import com.mentormatching.modules.booking.application.port.out.BookingMentorLookupPort;
import com.mentormatching.modules.booking.application.port.out.BookingMentorSubjectLookupPort;
import com.mentormatching.modules.booking.application.port.out.BookingNotificationPort;
import com.mentormatching.modules.booking.application.port.out.BookingRepositoryPort;
import com.mentormatching.modules.booking.application.port.out.BookingUserLookupPort;
import com.mentormatching.modules.booking.domain.Booking;
import com.mentormatching.modules.booking.domain.BookingCreateData;
import com.mentormatching.modules.booking.domain.BookingMeetingType;
import com.mentormatching.modules.booking.domain.BookingStatus;
import com.mentormatching.modules.mentor.domain.MeetingType;
import com.mentormatching.modules.payment.application.port.out.PaymentRepositoryPort;
import com.mentormatching.modules.payment.domain.Payment;
import com.mentormatching.modules.payment.domain.PaymentStatus;
import com.mentormatching.shared.exception.InvalidDataException;
import com.mentormatching.shared.exception.ResourceNotFoundException;
import com.mentormatching.shared.response.PageResponse;

@Service
public class BookingService implements CreateBookingUseCase, GetBookingPaymentSummaryUseCase, GetBookingsUseCase,
        GetMyBookingsUseCase, GetMentorBookingsUseCase, RejectBookingByMentorUseCase,
        CompleteBookingByMentorUseCase, GetMentorScheduleBlocksUseCase, GetBookingUseCase {

    private static final List<BookingStatus> SCHEDULE_BLOCKING_STATUSES = List.of(BookingStatus.PENDING,
            BookingStatus.CONFIRMED);

    private final BookingRepositoryPort bookingRepositoryPort;
    private final BookingUserLookupPort bookingUserLookupPort;
    private final BookingMentorLookupPort bookingMentorLookupPort;
    private final BookingMentorSubjectLookupPort bookingMentorSubjectLookupPort;
    private final BookingAvailabilityLookupPort bookingAvailabilityLookupPort;
    private final PaymentRepositoryPort paymentRepositoryPort;
    private final BookingNotificationPort bookingNotificationPort;

    public BookingService(BookingRepositoryPort bookingRepositoryPort, BookingUserLookupPort bookingUserLookupPort,
                          BookingMentorLookupPort bookingMentorLookupPort,
                          BookingMentorSubjectLookupPort bookingMentorSubjectLookupPort,
                          BookingAvailabilityLookupPort bookingAvailabilityLookupPort,
                          PaymentRepositoryPort paymentRepositoryPort,
                          BookingNotificationPort bookingNotificationPort) {
        this.bookingRepositoryPort = bookingRepositoryPort;
        this.bookingUserLookupPort = bookingUserLookupPort;
        this.bookingMentorLookupPort = bookingMentorLookupPort;
        this.bookingMentorSubjectLookupPort = bookingMentorSubjectLookupPort;
        this.bookingAvailabilityLookupPort = bookingAvailabilityLookupPort;
        this.paymentRepositoryPort = paymentRepositoryPort;
        this.bookingNotificationPort = bookingNotificationPort;
    }

    @Override
    @Transactional
    public Long createBooking(CreateBookingCommand command) {
        BookingUserSnapshot student = bookingUserLookupPort.getUserSnapshot(command.studentUserId());
        BookingMentorSnapshot mentor = bookingMentorLookupPort.getMentorSnapshot(command.mentorId());
        BookingMentorSubjectSnapshot mentorSubject = bookingMentorSubjectLookupPort.getMentorSubjectSnapshot(
                command.mentorSubjectId());
        validateMentorSubject(command, mentorSubject);
        validateMeetingType(command.meetingType(), mentor.meetingType());
        validateMentorAvailability(command);
        validateMentorScheduleAvailable(command);

        Booking booking = Booking.create(new BookingCreateData(command.studentUserId(), student.fullName(),
                command.mentorId(), mentor.fullName(), command.mentorSubjectId(), mentorSubject.subjectName(),
                mentorSubject.gradeName(), command.bookingDate(), command.startTime(), command.endTime(),
                mentorSubject.pricePerHour(), command.meetingType(), command.note()));

        Booking savedBooking = bookingRepositoryPort.save(booking);
        bookingNotificationPort.notifyBookingCreated(savedBooking);
        return savedBooking.getId();
    }

    @Override
    @Transactional(readOnly = true)
    public BookingPaymentSummary getBookingPaymentSummary(Long bookingId) {
        Booking booking = bookingRepositoryPort.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        return new BookingPaymentSummary(booking.getId(), booking.getStudentUserId(), booking.getTotalAmount(),
                booking.getStatus());
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<Booking> getBookings(GetBookingsQuery query) {
        validateBookingDateRange(query);
        return bookingRepositoryPort.findBookings(query);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<Booking> getMyBookings(GetMyBookingsQuery query) {
        return bookingRepositoryPort.findMyBookings(query);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<Booking> getMentorBookings(GetMentorBookingsQuery query) {
        validateBookingDateRange(query.bookingDateFrom(), query.bookingDateTo());

        // lấy mentor profile id từ user id
        BookingMentorSnapshot mentor = bookingMentorLookupPort.getMentorSnapshotByUserId(query.mentorUserId());
        return bookingRepositoryPort.findMentorBookings(mentor.mentorId(), query);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingScheduleBlock> getMentorScheduleBlocks(Long mentorId, LocalDate from, LocalDate to) {
        return bookingRepositoryPort.findScheduleBlockingBookings(mentorId, from, to,
                        SCHEDULE_BLOCKING_STATUSES).stream()
                .map(booking -> new BookingScheduleBlock(booking.getBookingDate(), booking.getStartTime(),
                        booking.getEndTime()))
                .toList();
    }

    @Override
    @Transactional
    public void rejectBookingByMentor(RejectBookingByMentorCommand command) {
        BookingMentorSnapshot mentor = bookingMentorLookupPort.getMentorSnapshotByUserId(command.mentorUserId());
        Booking booking = bookingRepositoryPort.findById(command.bookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        ensureBookingBelongsToMentor(mentor.mentorId(), booking);
        ensureBookingHasNoPaidPayment(booking.getId());
        booking.reject(command.mentorUserId(), command.cancelReason());
        bookingRepositoryPort.save(booking);
        bookingNotificationPort.notifyBookingRejected(booking);
    }

    @Override
    @Transactional
    public void completeBookingByMentor(Long mentorUserId, Long bookingId) {
        BookingMentorSnapshot mentor = bookingMentorLookupPort.getMentorSnapshotByUserId(mentorUserId);
        Booking booking = bookingRepositoryPort.findById(bookingId).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        ensureBookingBelongsToMentor(mentor.mentorId(), booking);
        booking.complete(LocalDateTime.now());
        bookingRepositoryPort.save(booking);
        bookingNotificationPort.notifyBookingCompleted(booking);
    }

    private void validateBookingDateRange(GetBookingsQuery query) {
        validateBookingDateRange(query.bookingDateFrom(), query.bookingDateTo());
    }

    private void validateBookingDateRange(LocalDate bookingDateFrom, LocalDate bookingDateTo) {
        if (bookingDateFrom != null && bookingDateTo != null && bookingDateFrom.isAfter(bookingDateTo)) {
            throw new InvalidDataException("Booking date from must not be after booking date to");
        }
    }

    private void validateMentorSubject(CreateBookingCommand command, BookingMentorSubjectSnapshot mentorSubject) {
        if (!mentorSubject.mentorId().equals(command.mentorId())) {
            throw new InvalidDataException("Mentor subject does not belong to mentor");
        }
        if (!mentorSubject.active()) {
            throw new InvalidDataException("Mentor subject is not active");
        }
    }

    private void validateMeetingType(BookingMeetingType bookingMeetingType, MeetingType mentorMeetingType) {
        if (mentorMeetingType == MeetingType.HYBRID) {
            return;
        }
        if (mentorMeetingType == null || !mentorMeetingType.name().equals(bookingMeetingType.name())) {
            throw new InvalidDataException("Mentor does not support this meeting type");
        }
    }

    private void validateMentorAvailability(CreateBookingCommand command) {
        boolean available = bookingAvailabilityLookupPort.isMentorAvailable(command.mentorId(), command.bookingDate(),
                command.startTime(), command.endTime());
        if (!available) {
            throw new InvalidDataException("Mentor is not available at this time");
        }
    }

    private void validateMentorScheduleAvailable(CreateBookingCommand command) {
        boolean overlapping = bookingRepositoryPort.existsOverlappingBooking(command.mentorId(), command.bookingDate(),
                command.startTime(), command.endTime(), SCHEDULE_BLOCKING_STATUSES);
        if (overlapping) {
            throw new InvalidDataException("Mentor already has a booking at this time");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Booking> getBooking(Long id) {
        return bookingRepositoryPort.findById(id);
    }

    private void ensureBookingBelongsToMentor(Long mentorId, Booking booking) {
        if (!mentorId.equals(booking.getMentorId())) {
            throw new ResourceNotFoundException("Booking not found");
        }
    }

    private void ensureBookingHasNoPaidPayment(Long bookingId) {
        Payment payment = paymentRepositoryPort.findByBookingId(bookingId).orElse(null);
        if (payment != null && payment.getStatus() == PaymentStatus.PAID) {
            throw new InvalidDataException("Paid booking cannot be rejected");
        }
    }
}
