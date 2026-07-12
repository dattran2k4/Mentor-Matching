package com.mentormatching.modules.mentor.application.dto;

import java.time.LocalDateTime;

import com.mentormatching.modules.mentor.domain.Gender;
import com.mentormatching.modules.mentor.domain.MeetingType;
import com.mentormatching.modules.mentor.domain.MentorApprovalStatus;
import com.mentormatching.modules.mentor.domain.MentorVerificationStatus;

public record CurrentMentorDetails(Long id, Long userId, String fullName, String avatarUrl, Long avatarMediaId, Gender gender,
                                   Long hometownCityId, String hometownCityName, Long currentCityId,
                                   String currentCityName, Long currentDistrictId, String currentDistrictName,
                                   String headline, String introduction, String teachingStyle,
                                   Integer experienceYears, String currentPosition, String workplace,
                                   String education, String major, MeetingType meetingType,
                                   MentorApprovalStatus approvalStatus, String approvalNote,
                                   MentorVerificationStatus verificationStatus,
                                   String verificationRejectionReason, LocalDateTime createdAt,
                                   LocalDateTime updatedAt) {

    public CurrentMentorDetails(Long id, Long userId, String fullName, String avatarUrl, Gender gender,
                                Long hometownCityId, String hometownCityName, Long currentCityId,
                                String currentCityName, Long currentDistrictId, String currentDistrictName,
                                String headline, String introduction, String teachingStyle,
                                Integer experienceYears, String currentPosition, String workplace,
                                String education, String major, MeetingType meetingType,
                                MentorApprovalStatus approvalStatus, String approvalNote,
                                MentorVerificationStatus verificationStatus,
                                String verificationRejectionReason, LocalDateTime createdAt,
                                LocalDateTime updatedAt) {
        this(id, userId, fullName, avatarUrl, null, gender, hometownCityId, hometownCityName, currentCityId,
                currentCityName, currentDistrictId, currentDistrictName, headline, introduction, teachingStyle,
                experienceYears, currentPosition, workplace, education, major, meetingType, approvalStatus,
                approvalNote, verificationStatus, verificationRejectionReason, createdAt, updatedAt);
    }
}
