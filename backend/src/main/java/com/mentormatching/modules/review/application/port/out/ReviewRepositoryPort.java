package com.mentormatching.modules.review.application.port.out;

import java.util.List;
import java.util.Optional;

import com.mentormatching.modules.review.domain.Review;

public interface ReviewRepositoryPort {

    Review save(Review review);

    Optional<Review> findById(Long id);

    Optional<Review> findByBookingId(Long bookingId);

    List<Review> findByStudentUserId(Long studentUserId);

    List<Review> findByMentorId(Long mentorId);

    com.mentormatching.shared.response.PageResponse<Review> findByMentorId(Long mentorId, int page, int size, String sortBy, String sortDir);

    void delete(Review review);
}
