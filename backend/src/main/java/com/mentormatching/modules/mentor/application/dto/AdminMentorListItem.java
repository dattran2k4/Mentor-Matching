package com.mentormatching.modules.mentor.application.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.mentormatching.modules.mentor.domain.Gender;
import com.mentormatching.modules.mentor.domain.MeetingType;
import com.mentormatching.modules.mentor.domain.MentorApprovalStatus;
import com.mentormatching.modules.mentor.domain.MentorVerificationStatus;

public record AdminMentorListItem(Long id, Long userId, String fullName, String avatarUrl, Gender gender,
                                  String headline, Integer experienceYears, String currentPosition,
                                  String workplace, String education, String major, MeetingType meetingType,
                                  MentorApprovalStatus approvalStatus, MentorVerificationStatus verificationStatus,
                                  BigDecimal minPrice, LocalDateTime createdAt) {
}
