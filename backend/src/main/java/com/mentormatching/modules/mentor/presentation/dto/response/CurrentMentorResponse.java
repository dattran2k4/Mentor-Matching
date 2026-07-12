package com.mentormatching.modules.mentor.presentation.dto.response;

import java.time.LocalDateTime;

import com.mentormatching.modules.mentor.application.dto.CurrentMentorDetails;
import com.mentormatching.modules.mentor.domain.Gender;
import com.mentormatching.modules.mentor.domain.MeetingType;
import com.mentormatching.modules.mentor.domain.MentorApprovalStatus;

public record CurrentMentorResponse(Long id, Long userId, String fullName, String avatarUrl, Long avatarMediaId, Gender gender,
                                    MentorDetailResponse.LocationResponse hometown,
                                    MentorDetailResponse.LocationResponse currentLocation, String headline,
                                    String introduction, String teachingStyle, Integer experienceYears,
                                    String currentPosition, String workplace, String education, String major,
                                    MeetingType meetingType, MentorApprovalStatus approvalStatus, String approvalNote,
                                    String verificationStatus, String verificationRejectionReason,
                                    LocalDateTime createdAt, LocalDateTime updatedAt) {

    public static CurrentMentorResponse from(CurrentMentorDetails mentor) {
        return new CurrentMentorResponse(mentor.id(), mentor.userId(), mentor.fullName(), mentor.avatarUrl(),
                mentor.avatarMediaId(), mentor.gender(),
                new MentorDetailResponse.LocationResponse(mentor.hometownCityId(), mentor.hometownCityName(), null,
                        null),
                new MentorDetailResponse.LocationResponse(mentor.currentCityId(), mentor.currentCityName(),
                        mentor.currentDistrictId(), mentor.currentDistrictName()),
                mentor.headline(), mentor.introduction(), mentor.teachingStyle(), mentor.experienceYears(),
                mentor.currentPosition(), mentor.workplace(), mentor.education(), mentor.major(),
                mentor.meetingType(), mentor.approvalStatus(), mentor.approvalNote(),
                mentor.verificationStatus() == null ? "UNVERIFIED" : mentor.verificationStatus().name(),
                mentor.verificationRejectionReason(), mentor.createdAt(), mentor.updatedAt());
    }
}
