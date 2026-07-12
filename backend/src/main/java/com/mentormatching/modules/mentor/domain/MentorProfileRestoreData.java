package com.mentormatching.modules.mentor.domain;

import java.time.LocalDateTime;

public record MentorProfileRestoreData(Long id, Long userId, String avatarUrl, Long avatarMediaId, Gender gender,
                                       Long hometownCityId, Long currentDistrictId, String headline, String introduction,
                                       String teachingStyle, Integer experienceYears, String currentPosition,
                                       String workplace, String education, String major, MeetingType meetingType,
                                       MentorApprovalStatus approvalStatus, String approvalNote, Long approvedBy,
                                       LocalDateTime approvedAt, LocalDateTime createdAt, LocalDateTime updatedAt) {

    public MentorProfileRestoreData(Long id, Long userId, String avatarUrl, Gender gender, Long hometownCityId,
                                    Long currentDistrictId, String headline, String introduction,
                                    String teachingStyle, Integer experienceYears, String currentPosition,
                                    String workplace, String education, String major, MeetingType meetingType,
                                    MentorApprovalStatus approvalStatus, String approvalNote, Long approvedBy,
                                    LocalDateTime approvedAt, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this(id, userId, avatarUrl, null, gender, hometownCityId, currentDistrictId, headline, introduction,
                teachingStyle, experienceYears, currentPosition, workplace, education, major, meetingType,
                approvalStatus, approvalNote, approvedBy, approvedAt, createdAt, updatedAt);
    }
}
