package com.mentormatching.modules.mentor.presentation.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.mentormatching.modules.mentor.application.dto.AdminMentorListItem;
import com.mentormatching.modules.mentor.domain.Gender;
import com.mentormatching.modules.mentor.domain.MeetingType;
import com.mentormatching.modules.mentor.domain.MentorApprovalStatus;
import com.mentormatching.modules.mentor.domain.MentorVerificationStatus;
import com.mentormatching.shared.response.PageResponse;

public record AdminMentorListItemResponse(Long id, Long userId, String fullName, String avatarUrl, Gender gender,
                                          String headline, Integer experienceYears, String currentPosition,
                                          String workplace, String education, String major,
                                          MeetingType meetingType, MentorApprovalStatus approvalStatus,
                                          MentorVerificationStatus verificationStatus,
                                          BigDecimal minPrice, LocalDateTime createdAt) {

    public static AdminMentorListItemResponse from(AdminMentorListItem mentor) {
        return new AdminMentorListItemResponse(mentor.id(), mentor.userId(), mentor.fullName(), mentor.avatarUrl(),
                mentor.gender(), mentor.headline(), mentor.experienceYears(), mentor.currentPosition(),
                mentor.workplace(), mentor.education(), mentor.major(), mentor.meetingType(),
                mentor.approvalStatus(), mentor.verificationStatus(), mentor.minPrice(), mentor.createdAt());
    }

    public static PageResponse<AdminMentorListItemResponse> from(PageResponse<AdminMentorListItem> mentors) {
        List<AdminMentorListItemResponse> data = mentors.getData().stream()
                .map(AdminMentorListItemResponse::from)
                .toList();
        return PageResponse.<AdminMentorListItemResponse>builder()
                .page(mentors.getPage())
                .pageSize(mentors.getPageSize())
                .totalPages(mentors.getTotalPages())
                .totalItems(mentors.getTotalItems())
                .data(data)
                .build();
    }
}
