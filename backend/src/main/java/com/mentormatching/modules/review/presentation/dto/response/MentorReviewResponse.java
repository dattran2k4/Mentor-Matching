package com.mentormatching.modules.review.presentation.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.mentormatching.modules.review.application.dto.MentorReviewItem;
import com.mentormatching.shared.response.PageResponse;

public record MentorReviewResponse(
        Long id,
        Long bookingId,
        Long studentUserId,
        String studentName,
        Integer rating,
        String comment,
        LocalDateTime createdAt
) {

    public static MentorReviewResponse from(MentorReviewItem item) {
        return new MentorReviewResponse(
                item.id(),
                item.bookingId(),
                item.studentUserId(),
                item.studentName(),
                item.rating(),
                item.comment(),
                item.createdAt()
        );
    }

    public static PageResponse<MentorReviewResponse> from(PageResponse<MentorReviewItem> page) {
        List<MentorReviewResponse> data = page.getData().stream()
                .map(MentorReviewResponse::from)
                .toList();
        return PageResponse.<MentorReviewResponse>builder()
                .page(page.getPage())
                .pageSize(page.getPageSize())
                .totalPages(page.getTotalPages())
                .totalItems(page.getTotalItems())
                .data(data)
                .build();
    }
}
