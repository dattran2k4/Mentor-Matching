package com.mentormatching.modules.review.infrastructure.persistence;

import java.util.List;
import java.util.Optional;

import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import com.mentormatching.modules.review.application.port.out.ReviewRepositoryPort;
import com.mentormatching.modules.review.domain.Review;
import com.mentormatching.modules.review.infrastructure.persistence.mapper.ReviewPersistenceMapper;
import com.mentormatching.modules.review.infrastructure.persistence.repository.ReviewJpaRepository;
import com.mentormatching.shared.pagination.PageableUtils;
import com.mentormatching.shared.response.PageResponse;

@Component
public class ReviewPersistenceAdapter implements ReviewRepositoryPort {

    private static final Set<String> SORTABLE_FIELDS = Set.of("id", "rating", "createdAt", "updatedAt");

    private final ReviewJpaRepository reviewJpaRepository;
    private final ReviewPersistenceMapper reviewPersistenceMapper;

    public ReviewPersistenceAdapter(ReviewJpaRepository reviewJpaRepository,
                                    ReviewPersistenceMapper reviewPersistenceMapper) {
        this.reviewJpaRepository = reviewJpaRepository;
        this.reviewPersistenceMapper = reviewPersistenceMapper;
    }

    @Override
    public Review save(Review review) {
        return reviewPersistenceMapper.toDomain(reviewJpaRepository.save(reviewPersistenceMapper.toEntity(review)));
    }

    @Override
    public Optional<Review> findById(Long id) {
        return reviewJpaRepository.findById(id).map(reviewPersistenceMapper::toDomain);
    }

    @Override
    public Optional<Review> findByBookingId(Long bookingId) {
        return reviewJpaRepository.findByBookingId(bookingId).map(reviewPersistenceMapper::toDomain);
    }

    @Override
    public List<Review> findByStudentUserId(Long studentUserId) {
        return reviewJpaRepository.findByStudentUserId(studentUserId).stream().map(reviewPersistenceMapper::toDomain).toList();
    }

    @Override
    public List<Review> findByMentorId(Long mentorId) {
        return reviewJpaRepository.findByMentorId(mentorId).stream().map(reviewPersistenceMapper::toDomain).toList();
    }

    @Override
    public PageResponse<Review> findByMentorId(Long mentorId, int page, int size, String sortBy, String sortDir) {
        Pageable pageable = PageableUtils.buildPageable(page, size, sortBy, sortDir, SORTABLE_FIELDS);
        Page<com.mentormatching.modules.review.infrastructure.persistence.entity.ReviewJpaEntity> reviewPage =
                reviewJpaRepository.findByMentorId(mentorId, pageable);
        return PageResponse.<Review>builder()
                .page(reviewPage.getNumber() + 1)
                .pageSize(reviewPage.getSize())
                .totalPages(reviewPage.getTotalPages())
                .totalItems(reviewPage.getTotalElements())
                .data(reviewPage.getContent().stream().map(reviewPersistenceMapper::toDomain).toList())
                .build();
    }

    @Override
    public void delete(Review review) {
        reviewJpaRepository.delete(reviewPersistenceMapper.toEntity(review));
    }
}
