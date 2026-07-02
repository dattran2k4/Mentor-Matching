package com.mentormatching.modules.review.application.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import com.mentormatching.modules.booking.domain.Booking;
import com.mentormatching.modules.booking.domain.BookingStatus;
import com.mentormatching.modules.review.application.dto.CreateReviewCommand;
import com.mentormatching.modules.review.application.dto.MentorRatingSummary;
import com.mentormatching.modules.review.application.dto.MentorReviewItem;
import com.mentormatching.modules.review.application.dto.ReviewDetail;
import com.mentormatching.modules.review.application.dto.UpdateReviewCommand;
import com.mentormatching.modules.review.application.port.in.CalculateMentorRatingSummaryUseCase;
import com.mentormatching.modules.review.application.port.in.CreateReviewUseCase;
import com.mentormatching.modules.review.application.port.in.GetMentorReviewsUseCase;
import com.mentormatching.modules.review.application.port.in.GetReviewDetailUseCase;
import com.mentormatching.modules.review.application.port.in.DeleteReviewUseCase;
import com.mentormatching.modules.review.application.port.in.UpdateReviewUseCase;
import com.mentormatching.modules.review.application.port.out.ReviewBookingLookupPort;
import com.mentormatching.modules.review.application.port.out.ReviewMentorLookupPort;
import com.mentormatching.modules.review.application.port.out.ReviewRepositoryPort;
import com.mentormatching.modules.review.application.port.out.ReviewUserLookupPort;
import com.mentormatching.modules.review.domain.Review;
import com.mentormatching.shared.exception.InvalidDataException;
import com.mentormatching.shared.exception.ResourceNotFoundException;
import com.mentormatching.shared.response.PageResponse;

@Service
public class ReviewService implements CreateReviewUseCase, GetReviewDetailUseCase, GetMentorReviewsUseCase, CalculateMentorRatingSummaryUseCase, UpdateReviewUseCase, DeleteReviewUseCase {

    private final ReviewRepositoryPort reviewRepositoryPort;
    private final ReviewBookingLookupPort reviewBookingLookupPort;
    private final ReviewUserLookupPort reviewUserLookupPort;
    private final ReviewMentorLookupPort reviewMentorLookupPort;

    public ReviewService(ReviewRepositoryPort reviewRepositoryPort,
                         ReviewBookingLookupPort reviewBookingLookupPort,
                         ReviewUserLookupPort reviewUserLookupPort,
                         ReviewMentorLookupPort reviewMentorLookupPort) {
        this.reviewRepositoryPort = reviewRepositoryPort;
        this.reviewBookingLookupPort = reviewBookingLookupPort;
        this.reviewUserLookupPort = reviewUserLookupPort;
        this.reviewMentorLookupPort = reviewMentorLookupPort;
    }

    @Override
    @Transactional
    public Long createReview(CreateReviewCommand command) {
        Booking booking = reviewBookingLookupPort.getBooking(command.bookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getStudentUserId().equals(command.studentUserId())) {
            throw new InvalidDataException("You are not authorized to review this booking");
        }

        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new InvalidDataException("Only completed bookings can be reviewed");
        }

        if (reviewRepositoryPort.findByBookingId(command.bookingId()).isPresent()) {
            throw new InvalidDataException("This booking has already been reviewed");
        }

        Review review = Review.create(
                command.bookingId(),
                command.studentUserId(),
                booking.getMentorId(),
                command.rating(),
                command.comment()
        );

        Review savedReview = reviewRepositoryPort.save(review);
        return savedReview.getId();
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewDetail getReviewDetail(Long id) {
        Review review = reviewRepositoryPort.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        String studentName = reviewUserLookupPort.getUserFullName(review.getStudentUserId());
        Long mentorUserId = reviewMentorLookupPort.getUserId(review.getMentorId());
        String mentorName = mentorUserId != null ? reviewUserLookupPort.getUserFullName(mentorUserId) : null;

        return new ReviewDetail(
                review.getId(),
                review.getBookingId(),
                review.getStudentUserId(),
                studentName,
                review.getMentorId(),
                mentorName,
                review.getRating(),
                review.getComment(),
                review.getCreatedAt(),
                review.getUpdatedAt()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<MentorReviewItem> getMentorReviews(Long mentorId, int page, int size, String sortBy, String sortDir) {
        PageResponse<Review> reviewPage = reviewRepositoryPort.findByMentorId(mentorId, page, size, sortBy, sortDir);

        List<MentorReviewItem> items = reviewPage.getData().stream().map(review -> {
            String studentName = reviewUserLookupPort.getUserFullName(review.getStudentUserId());
            return new MentorReviewItem(
                    review.getId(),
                    review.getBookingId(),
                    review.getStudentUserId(),
                    studentName,
                    review.getRating(),
                    review.getComment(),
                    review.getCreatedAt()
            );
        }).toList();

        return PageResponse.<MentorReviewItem>builder()
                .page(reviewPage.getPage())
                .pageSize(reviewPage.getPageSize())
                .totalPages(reviewPage.getTotalPages())
                .totalItems(reviewPage.getTotalItems())
                .data(items)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public MentorRatingSummary calculateMentorRatingSummary(Long mentorId) {
        List<Review> reviews = reviewRepositoryPort.findByMentorId(mentorId);

        long totalReviews = reviews.size();
        double averageRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        averageRating = Math.round(averageRating * 10.0) / 10.0;

        Map<Integer, Long> distribution = reviews.stream()
                .collect(Collectors.groupingBy(
                        Review::getRating,
                        Collectors.counting()
                ));

        for (int i = 1; i <= 5; i++) {
            distribution.putIfAbsent(i, 0L);
        }

        return new MentorRatingSummary(averageRating, totalReviews, distribution);
    }

    @Override
    @Transactional
    public void updateReview(UpdateReviewCommand command) {
        Review review = reviewRepositoryPort.findById(command.reviewId())
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getStudentUserId().equals(command.studentUserId())) {
            throw new InvalidDataException("You are not authorized to update this review");
        }

        if (review.getCreatedAt().plusDays(30).isBefore(LocalDateTime.now())) {
            throw new InvalidDataException("Reviews can only be updated within 30 days of creation");
        }

        review.update(command.rating(), command.comment());
        reviewRepositoryPort.save(review);
    }

    @Override
    @Transactional
    public void deleteReview(Long reviewId, Long currentUserId, boolean isAdminOrManager) {
        Review review = reviewRepositoryPort.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!isAdminOrManager && !review.getStudentUserId().equals(currentUserId)) {
            throw new InvalidDataException("You are not authorized to delete this review");
        }

        reviewRepositoryPort.delete(review);
    }
}
