package com.mentormatching.modules.mentor.application.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mentormatching.modules.mentor.application.dto.CurrentMentorDetails;
import com.mentormatching.modules.mentor.application.dto.UpdateCurrentMentorCommand;
import com.mentormatching.modules.mentor.application.port.in.UpdateCurrentMentorUseCase;
import com.mentormatching.modules.mentor.application.port.out.MentorLocationLookupPort;
import com.mentormatching.modules.mentor.application.port.out.MentorProfileRepositoryPort;
import com.mentormatching.modules.mentor.application.port.out.MentorReadRepositoryPort;
import com.mentormatching.modules.mentor.domain.MentorProfile;
import com.mentormatching.shared.exception.ResourceNotFoundException;

@Service
public class MentorProfileService implements UpdateCurrentMentorUseCase {

    private final MentorProfileRepositoryPort mentorProfileRepositoryPort;
    private final MentorReadRepositoryPort mentorReadRepositoryPort;
    private final MentorLocationLookupPort mentorLocationLookupPort;

    public MentorProfileService(MentorProfileRepositoryPort mentorProfileRepositoryPort,
                                MentorReadRepositoryPort mentorReadRepositoryPort,
                                MentorLocationLookupPort mentorLocationLookupPort) {
        this.mentorProfileRepositoryPort = mentorProfileRepositoryPort;
        this.mentorReadRepositoryPort = mentorReadRepositoryPort;
        this.mentorLocationLookupPort = mentorLocationLookupPort;
    }

    @Override
    @Transactional
    public CurrentMentorDetails updateCurrentMentor(UpdateCurrentMentorCommand command) {
        MentorProfile mentorProfile = mentorProfileRepositoryPort.findByUserId(command.userId())
                .orElseThrow(() -> new ResourceNotFoundException("Mentor profile not found"));

        validateLocationReferences(command);

        mentorProfile.updateProfile(command.gender(), command.hometownCityId(), command.currentDistrictId(),
                command.headline(), command.introduction(), command.teachingStyle(), command.experienceYears(),
                command.currentPosition(), command.workplace(), command.education(), command.major(),
                command.meetingType());
        MentorProfile savedMentorProfile = mentorProfileRepositoryPort.save(mentorProfile);

        return mentorReadRepositoryPort.findCurrentMentorByMentorId(savedMentorProfile.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Mentor profile not found"));
    }

    private void validateLocationReferences(UpdateCurrentMentorCommand command) {
        if (command.hometownCityId() != null) {
            mentorLocationLookupPort.getCity(command.hometownCityId());
        }
        if (command.currentDistrictId() != null) {
            mentorLocationLookupPort.getDistrict(command.currentDistrictId());
        }
    }
}
