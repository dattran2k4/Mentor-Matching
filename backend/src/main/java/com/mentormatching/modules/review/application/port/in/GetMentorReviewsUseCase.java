package com.mentormatching.modules.review.application.port.in;

import com.mentormatching.modules.review.application.dto.MentorReviewItem;
import com.mentormatching.shared.response.PageResponse;

public interface GetMentorReviewsUseCase {

    PageResponse<MentorReviewItem> getMentorReviews(Long mentorId, int page, int size, String sortBy, String sortDir);
}
