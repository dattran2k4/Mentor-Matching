package com.mentormatching.modules.mentor.infrastructure.persistence.repository;

import java.time.LocalDateTime;

import com.mentormatching.modules.mentor.domain.Gender;
import com.mentormatching.modules.mentor.domain.MeetingType;
import com.mentormatching.modules.mentor.domain.MentorApprovalStatus;
import com.mentormatching.modules.mentor.domain.MentorVerificationStatus;

public interface CurrentMentorDetailsProjection {

    Long getId();

    Long getUserId();

    String getFullName();

    String getAvatarUrl();

    Long getAvatarMediaId();

    Gender getGender();

    Long getHometownCityId();

    String getHometownCityName();

    Long getCurrentCityId();

    String getCurrentCityName();

    Long getCurrentDistrictId();

    String getCurrentDistrictName();

    String getHeadline();

    String getIntroduction();

    String getTeachingStyle();

    Integer getExperienceYears();

    String getCurrentPosition();

    String getWorkplace();

    String getEducation();

    String getMajor();

    MeetingType getMeetingType();

    MentorApprovalStatus getApprovalStatus();

    String getApprovalNote();

    MentorVerificationStatus getVerificationStatus();

    String getVerificationRejectionReason();

    LocalDateTime getCreatedAt();

    LocalDateTime getUpdatedAt();
}
