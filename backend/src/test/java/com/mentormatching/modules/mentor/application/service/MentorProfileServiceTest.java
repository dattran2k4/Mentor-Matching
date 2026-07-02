package com.mentormatching.modules.mentor.application.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.mentormatching.modules.mentor.application.dto.CurrentMentorDetails;
import com.mentormatching.modules.mentor.application.dto.UpdateCurrentMentorCommand;
import com.mentormatching.modules.mentor.application.port.out.MentorLocationLookupPort;
import com.mentormatching.modules.mentor.application.port.out.MentorProfileRepositoryPort;
import com.mentormatching.modules.mentor.application.port.out.MentorReadRepositoryPort;
import com.mentormatching.modules.mentor.domain.Gender;
import com.mentormatching.modules.mentor.domain.MeetingType;
import com.mentormatching.modules.mentor.domain.MentorApprovalStatus;
import com.mentormatching.modules.mentor.domain.MentorProfile;
import com.mentormatching.modules.mentor.domain.MentorProfileRestoreData;
import com.mentormatching.modules.mentor.domain.MentorVerificationStatus;
import com.mentormatching.shared.exception.InvalidDataException;
import com.mentormatching.shared.exception.ResourceNotFoundException;

class MentorProfileServiceTest {

    private MentorProfileRepositoryPort mentorProfileRepositoryPort;
    private MentorReadRepositoryPort mentorReadRepositoryPort;
    private MentorLocationLookupPort mentorLocationLookupPort;
    private MentorProfileService mentorProfileService;

    @BeforeEach
    void setUp() {
        mentorProfileRepositoryPort = mock(MentorProfileRepositoryPort.class);
        mentorReadRepositoryPort = mock(MentorReadRepositoryPort.class);
        mentorLocationLookupPort = mock(MentorLocationLookupPort.class);
        mentorProfileService = new MentorProfileService(mentorProfileRepositoryPort, mentorReadRepositoryPort,
                mentorLocationLookupPort);
    }

    @Test
    void updateCurrentMentorUpdatesProfileAndReturnsFreshDetails() {
        MentorProfile mentorProfile = MentorProfile.restore(new MentorProfileRestoreData(10L, 20L,
                "https://old.example.com/avatar.jpg", Gender.FEMALE, 1L, 2L, "Old headline",
                "Old intro", "Old style", 3, "Old position", "Old workplace", "Old education",
                "Old major", MeetingType.ONLINE, MentorApprovalStatus.PENDING, null, null, null,
                LocalDateTime.parse("2026-06-01T10:15:30"), LocalDateTime.parse("2026-06-02T10:15:30")));
        UpdateCurrentMentorCommand command = new UpdateCurrentMentorCommand(20L,
                "https://new.example.com/avatar.jpg", Gender.MALE, 11L, 22L, "New headline",
                "New intro", "New style", 7, "New position", "New workplace", "New education",
                "New major", MeetingType.HYBRID);
        CurrentMentorDetails expected = new CurrentMentorDetails(10L, 20L, "Nguyen Minh Anh",
                "https://new.example.com/avatar.jpg", Gender.MALE, 11L, "Ha Noi", 33L, "Ho Chi Minh City", 22L,
                "District 1", "New headline", "New intro", "New style", 7, "New position", "New workplace",
                "New education", "New major", MeetingType.HYBRID, MentorApprovalStatus.PENDING, null,
                MentorVerificationStatus.PENDING, null, LocalDateTime.parse("2026-06-01T10:15:30"),
                LocalDateTime.parse("2026-06-06T09:00:00"));

        when(mentorProfileRepositoryPort.findByUserId(20L)).thenReturn(Optional.of(mentorProfile));
        when(mentorProfileRepositoryPort.save(mentorProfile)).thenReturn(mentorProfile);
        when(mentorReadRepositoryPort.findCurrentMentorByMentorId(10L)).thenReturn(Optional.of(expected));

        CurrentMentorDetails actual = mentorProfileService.updateCurrentMentor(command);

        assertEquals(expected, actual);
        assertEquals("https://old.example.com/avatar.jpg", mentorProfile.getAvatarUrl());
        assertEquals(Gender.MALE, mentorProfile.getGender());
        assertEquals(11L, mentorProfile.getHometownCityId());
        assertEquals(22L, mentorProfile.getCurrentDistrictId());
        assertEquals("New headline", mentorProfile.getHeadline());
        assertEquals("New intro", mentorProfile.getIntroduction());
        assertEquals("New style", mentorProfile.getTeachingStyle());
        assertEquals(7, mentorProfile.getExperienceYears());
        assertEquals("New position", mentorProfile.getCurrentPosition());
        assertEquals("New workplace", mentorProfile.getWorkplace());
        assertEquals("New education", mentorProfile.getEducation());
        assertEquals("New major", mentorProfile.getMajor());
        assertEquals(MeetingType.HYBRID, mentorProfile.getMeetingType());
        verify(mentorLocationLookupPort).getCity(11L);
        verify(mentorLocationLookupPort).getDistrict(22L);
    }

    @Test
    void updateCurrentMentorThrowsWhenExperienceYearsIsNegative() {
        MentorProfile mentorProfile = MentorProfile.restore(new MentorProfileRestoreData(10L, 20L,
                "https://old.example.com/avatar.jpg", Gender.FEMALE, null, null, null, null, null, null, null,
                null, null, null, null, MentorApprovalStatus.PENDING, null, null, null,
                LocalDateTime.parse("2026-06-01T10:15:30"), LocalDateTime.parse("2026-06-02T10:15:30")));
        UpdateCurrentMentorCommand command = new UpdateCurrentMentorCommand(20L,
                "https://new.example.com/avatar.jpg", Gender.MALE, null, null, null, null, null, -1,
                null, null, null, null, null);

        when(mentorProfileRepositoryPort.findByUserId(20L)).thenReturn(Optional.of(mentorProfile));

        InvalidDataException exception = assertThrows(InvalidDataException.class,
                () -> mentorProfileService.updateCurrentMentor(command));

        assertEquals("Experience years must be greater than or equal to 0", exception.getMessage());
    }

    @Test
    void updateCurrentMentorThrowsWhenMentorProfileDoesNotExist() {
        UpdateCurrentMentorCommand command = new UpdateCurrentMentorCommand(99L,
                "https://new.example.com/avatar.jpg", Gender.MALE, null, null, null, null, null, 2,
                null, null, null, null, null);

        when(mentorProfileRepositoryPort.findByUserId(99L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> mentorProfileService.updateCurrentMentor(command));

        assertEquals("Mentor profile not found", exception.getMessage());
    }
}
