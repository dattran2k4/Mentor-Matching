package com.mentormatching.modules.booking.presentation;

import static com.mentormatching.shared.response.PageQueryDefaults.DEFAULT_PAGE;
import static com.mentormatching.shared.response.PageQueryDefaults.DEFAULT_SIZE;
import static com.mentormatching.shared.response.PageQueryDefaults.DEFAULT_SORT_BY;
import static com.mentormatching.shared.response.PageQueryDefaults.DEFAULT_SORT_DIR;

import java.time.LocalDate;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mentormatching.modules.booking.application.dto.GetBookingsQuery;
import com.mentormatching.modules.booking.application.dto.GetMentorBookingsQuery;
import com.mentormatching.modules.booking.application.dto.GetMyBookingsQuery;
import com.mentormatching.modules.booking.application.port.in.AdminForceCancelBookingUseCase;
import com.mentormatching.modules.booking.application.port.in.CompleteBookingByMentorUseCase;
import com.mentormatching.modules.booking.application.port.in.CreateBookingUseCase;
import com.mentormatching.modules.booking.application.port.in.GetBookingsUseCase;
import com.mentormatching.modules.booking.application.port.in.GetMentorBookingsUseCase;
import com.mentormatching.modules.booking.application.port.in.GetMyBookingsUseCase;
import com.mentormatching.modules.booking.application.port.in.RejectBookingByMentorUseCase;
import com.mentormatching.modules.booking.domain.Booking;
import com.mentormatching.modules.booking.domain.BookingMeetingType;
import com.mentormatching.modules.booking.domain.BookingStatus;
import com.mentormatching.modules.booking.presentation.dto.request.CreateBookingRequest;
import com.mentormatching.modules.booking.presentation.dto.request.ForceCancelBookingRequest;
import com.mentormatching.modules.booking.presentation.dto.request.RejectBookingRequest;
import com.mentormatching.modules.booking.presentation.dto.response.BookingResponse;
import com.mentormatching.modules.booking.presentation.dto.response.CreateBookingResponse;
import com.mentormatching.shared.response.ApiResponse;
import com.mentormatching.shared.response.ApiResponseFactory;
import com.mentormatching.shared.response.PageResponse;
import com.mentormatching.shared.security.model.AuthenticatedPrincipal;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping("/api/v1/bookings")
public class BookingController {

    private final CreateBookingUseCase createBookingUseCase;
    private final GetBookingsUseCase getBookingsUseCase;
    private final GetMyBookingsUseCase getMyBookingsUseCase;
    private final GetMentorBookingsUseCase getMentorBookingsUseCase;
    private final RejectBookingByMentorUseCase rejectBookingByMentorUseCase;
    private final CompleteBookingByMentorUseCase completeBookingByMentorUseCase;
    private final AdminForceCancelBookingUseCase adminForceCancelBookingUseCase;
    private final ApiResponseFactory apiResponseFactory;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<CreateBookingResponse> createBooking(@AuthenticationPrincipal AuthenticatedPrincipal principal,
                                                            @Valid @RequestBody CreateBookingRequest request) {
        Long bookingId = createBookingUseCase.createBooking(request.toCommand(principal));
        return apiResponseFactory.created(CreateBookingResponse.from(bookingId), "Create booking successfully");
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ApiResponse<PageResponse<BookingResponse>> getBookings(@RequestParam(defaultValue = DEFAULT_PAGE) @Min(1) int page,
                                                                  @RequestParam(defaultValue = DEFAULT_SIZE) @Min(1) @Max(100) int size,
                                                                  @RequestParam(defaultValue = DEFAULT_SORT_BY) String sortBy,
                                                                  @RequestParam(defaultValue = DEFAULT_SORT_DIR) String sortDir,
                                                                  @RequestParam(required = false) BookingStatus status,
                                                                  @RequestParam(required = false) BookingMeetingType meetingType,
                                                                  @RequestParam(required = false) String mentorName,
                                                                  @RequestParam(required = false) String studentName,
                                                                  @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate bookingDateFrom,
                                                                  @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate bookingDateTo) {
        PageResponse<Booking> bookings = getBookingsUseCase.getBookings(new GetBookingsQuery(page, size, sortBy,
                sortDir, status, meetingType, mentorName, studentName, bookingDateFrom, bookingDateTo));
        return apiResponseFactory.success(BookingResponse.from(bookings), "Get bookings successfully");
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<PageResponse<BookingResponse>> getMyBookings(@AuthenticationPrincipal AuthenticatedPrincipal principal,
                                                                    @RequestParam(defaultValue = DEFAULT_PAGE) @Min(1) int page,
                                                                    @RequestParam(defaultValue = DEFAULT_SIZE) @Min(1) @Max(100) int size,
                                                                    @RequestParam(defaultValue = DEFAULT_SORT_BY) String sortBy,
                                                                    @RequestParam(defaultValue = DEFAULT_SORT_DIR) String sortDir,
                                                                    @RequestParam(required = false) BookingStatus status,
                                                                    @RequestParam(required = false) BookingMeetingType meetingType) {
        PageResponse<Booking> bookings = getMyBookingsUseCase.getMyBookings(new GetMyBookingsQuery(
                principal.getId(), page, size, sortBy, sortDir, status, meetingType));
        return apiResponseFactory.success(BookingResponse.from(bookings), "Get my bookings successfully");
    }

    @GetMapping("/mentor/me")
    @PreAuthorize("hasRole('MENTOR')")
    public ApiResponse<PageResponse<BookingResponse>> getMentorBookings(@AuthenticationPrincipal AuthenticatedPrincipal principal,
                                                                        @RequestParam(defaultValue = DEFAULT_PAGE) @Min(1) int page,
                                                                        @RequestParam(defaultValue = DEFAULT_SIZE) @Min(1) @Max(100) int size,
                                                                        @RequestParam(defaultValue = DEFAULT_SORT_BY) String sortBy,
                                                                        @RequestParam(defaultValue = DEFAULT_SORT_DIR) String sortDir,
                                                                        @RequestParam(required = false) BookingStatus status,
                                                                        @RequestParam(required = false) BookingMeetingType meetingType,
                                                                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate bookingDateFrom,
                                                                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate bookingDateTo) {
        PageResponse<Booking> bookings = getMentorBookingsUseCase.getMentorBookings(new GetMentorBookingsQuery(
                principal.getId(), page, size, sortBy, sortDir, status, meetingType, bookingDateFrom, bookingDateTo));
        return apiResponseFactory.success(BookingResponse.from(bookings), "Get mentor bookings successfully");
    }

    @PatchMapping("/{bookingId}/reject")
    @PreAuthorize("hasRole('MENTOR')")
    public ApiResponse<Void> rejectBookingByMentor(@AuthenticationPrincipal AuthenticatedPrincipal principal,
                                                   @PathVariable Long bookingId,
                                                   @Valid @RequestBody RejectBookingRequest request) {
        rejectBookingByMentorUseCase.rejectBookingByMentor(request.toCommand(principal, bookingId));
        return apiResponseFactory.success(null, "Reject booking successfully");
    }

    @PatchMapping("/{bookingId}/complete")
    @PreAuthorize("hasRole('MENTOR')")
    public ApiResponse<Void> completeBookingByMentor(@AuthenticationPrincipal AuthenticatedPrincipal principal,
                                                     @PathVariable Long bookingId) {
        completeBookingByMentorUseCase.completeBookingByMentor(principal.getId(), bookingId);
        return apiResponseFactory.success(null, "Complete booking successfully");
    }

    @PatchMapping("/{bookingId}/force-cancel")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> forceCancelBooking(@AuthenticationPrincipal AuthenticatedPrincipal principal,
                                                @PathVariable Long bookingId,
                                                @Valid @RequestBody ForceCancelBookingRequest request) {
        adminForceCancelBookingUseCase.forceCancelBooking(request.toCommand(principal, bookingId));
        return apiResponseFactory.success(null, "Force cancel booking successfully");
    }
}
