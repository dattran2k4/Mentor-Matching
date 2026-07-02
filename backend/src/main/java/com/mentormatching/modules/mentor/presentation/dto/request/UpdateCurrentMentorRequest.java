package com.mentormatching.modules.mentor.presentation.dto.request;

import com.mentormatching.modules.mentor.application.dto.UpdateCurrentMentorCommand;
import com.mentormatching.modules.mentor.domain.Gender;
import com.mentormatching.modules.mentor.domain.MeetingType;
import com.mentormatching.shared.security.model.AuthenticatedPrincipal;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public record UpdateCurrentMentorRequest(
        Gender gender,
        Long hometownCityId,
        Long currentDistrictId,
        @Size(max = 255, message = "Headline must not exceed 255 characters") String headline,
        String introduction,
        String teachingStyle,
        @Min(value = 0, message = "Experience years must be greater than or equal to 0") Integer experienceYears,
        @Size(max = 255, message = "Current position must not exceed 255 characters") String currentPosition,
        @Size(max = 255, message = "Workplace must not exceed 255 characters") String workplace,
        @Size(max = 255, message = "Education must not exceed 255 characters") String education,
        @Size(max = 255, message = "Major must not exceed 255 characters") String major,
        MeetingType meetingType
) {

    public UpdateCurrentMentorCommand toCommand(AuthenticatedPrincipal principal) {
        return new UpdateCurrentMentorCommand(principal.getId(), gender, hometownCityId, currentDistrictId,
                headline, introduction, teachingStyle, experienceYears, currentPosition, workplace, education,
                major, meetingType);
    }
}
