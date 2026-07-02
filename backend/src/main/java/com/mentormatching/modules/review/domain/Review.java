package com.mentormatching.modules.review.domain;

import java.time.LocalDateTime;

import com.mentormatching.shared.exception.InvalidDataException;

public class Review {

    private final Long id;
    private final Long bookingId;
    private final Long studentUserId;
    private final Long mentorId;
    private Integer rating;
    private String comment;
    private final LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Review(ReviewRestoreData data) {
        this.id = data.id();
        this.bookingId = data.bookingId();
        this.studentUserId = data.studentUserId();
        this.mentorId = data.mentorId();
        this.rating = data.rating();
        this.comment = data.comment();
        this.createdAt = data.createdAt();
        this.updatedAt = data.updatedAt();
    }

    public static Review restore(ReviewRestoreData data) {
        return new Review(data);
    }

    public static Review create(Long bookingId, Long studentUserId, Long mentorId, Integer rating, String comment) {
        validateRating(rating);
        LocalDateTime now = LocalDateTime.now();
        return new Review(new ReviewRestoreData(null, bookingId, studentUserId, mentorId, rating, comment, now, now));
    }

    public void update(Integer rating, String comment) {
        validateRating(rating);
        this.rating = rating;
        this.comment = comment;
        this.updatedAt = LocalDateTime.now();
    }

    private static void validateRating(Integer rating) {
        if (rating == null) {
            throw new InvalidDataException("Rating is required");
        }
        if (rating < 1 || rating > 5) {
            throw new InvalidDataException("Rating must be between 1 and 5");
        }
    }

    public Long getId() {
        return id;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public Long getStudentUserId() {
        return studentUserId;
    }

    public Long getMentorId() {
        return mentorId;
    }

    public Integer getRating() {
        return rating;
    }

    public String getComment() {
        return comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
