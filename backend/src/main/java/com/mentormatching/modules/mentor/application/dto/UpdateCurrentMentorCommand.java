package com.mentormatching.modules.mentor.application.dto;

import com.mentormatching.modules.mentor.domain.Gender;
import com.mentormatching.modules.mentor.domain.MeetingType;

public record UpdateCurrentMentorCommand(Long userId, Gender gender, Long hometownCityId, Long currentDistrictId,
                                         String headline, String introduction, String teachingStyle,
                                         Integer experienceYears, String currentPosition, String workplace,
                                         String education, String major, MeetingType meetingType) {

    public UpdateCurrentMentorCommand(Long userId, String ignoredAvatarUrl, Gender gender, Long hometownCityId,
                                      Long currentDistrictId, String headline, String introduction,
                                      String teachingStyle, Integer experienceYears, String currentPosition,
                                      String workplace, String education, String major, MeetingType meetingType) {
        this(userId, gender, hometownCityId, currentDistrictId, headline, introduction, teachingStyle,
                experienceYears, currentPosition, workplace, education, major, meetingType);
    }
}
