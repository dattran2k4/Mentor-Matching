package com.mentormatching.modules.mentor.application.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
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

class CreateCurrentMentorServiceTest {

    private MentorProfileRepositoryPort mentorProfileRepositoryPort;
    private MentorReadRepositoryPort mentorReadRepositoryPort;
    private MentorLocationLookupPort mentorLocationLookupPort;
    private CreateCurrentMentorService createCurrentMentorService;

    @BeforeEach
    void setUp() {
        mentorProfileRepositoryPort = mock(MentorProfileRepositoryPort.class);
        mentorReadRepositoryPort = mock(MentorReadRepositoryPort.class);
        mentorLocationLookupPort = mock(MentorLocationLookupPort.class);
        createCurrentMentorService = new CreateCurrentMentorService(mentorProfileRepositoryPort,
                mentorReadRepositoryPort, mentorLocationLookupPort);
    }

    @Test
    void createCurrentMentorCreatesDraftProfileAndReturnsFreshDetails() {
        UpdateCurrentMentorCommand command = new UpdateCurrentMentorCommand(20L,
                "https://new.example.com/avatar.jpg", Gender.MALE, 11L, 22L, "New headline",
                "New intro", "New style", 7, "New position", "New workplace", "New education",
                "New major", MeetingType.HYBRID);
        CurrentMentorDetails expected = new CurrentMentorDetails(10L, 20L, "Nguyen Minh Anh",
                "https://new.example.com/avatar.jpg", Gender.MALE, 11L, "Ha Noi", 33L, "Ho Chi Minh City", 22L,
                "District 1", "New headline", "New intro", "New style", 7, "New position", "New workplace",
                "New education", "New major", MeetingType.HYBRID, MentorApprovalStatus.DRAFT, null,
                MentorVerificationStatus.PENDING, null, LocalDateTime.parse("2026-06-01T10:15:30"),
                LocalDateTime.parse("2026-06-01T10:15:30"));

        when(mentorProfileRepositoryPort.existsByUserId(20L)).thenReturn(false);
        MentorProfile savedMentorProfile = MentorProfile.restore(new MentorProfileRestoreData(10L, 20L, "", null,
                Gender.MALE, 11L, 22L, "New headline", "New intro", "New style", 7, "New position",
                "New workplace", "New education", "New major", MeetingType.HYBRID, MentorApprovalStatus.DRAFT, null,
                null, null, LocalDateTime.parse("2026-06-01T10:15:30"),
                LocalDateTime.parse("2026-06-01T10:15:30")));
        when(mentorProfileRepositoryPort.save(any())).thenReturn(savedMentorProfile);
        when(mentorReadRepositoryPort.findCurrentMentorByMentorId(10L)).thenReturn(Optional.of(expected));

        CurrentMentorDetails actual = createCurrentMentorService.createCurrentMentor(command);

        assertEquals(expected, actual);
        verify(mentorProfileRepositoryPort).save(any());
        verify(mentorLocationLookupPort).getCity(11L);
        verify(mentorLocationLookupPort).getDistrict(22L);
    }

    @Test
    void createCurrentMentorThrowsWhenMentorProfileAlreadyExists() {
        UpdateCurrentMentorCommand command = new UpdateCurrentMentorCommand(20L,
                "https://new.example.com/avatar.jpg", Gender.MALE, null, null, null, null, null, 2,
                null, null, null, null, null);

        when(mentorProfileRepositoryPort.existsByUserId(20L)).thenReturn(true);

        InvalidDataException exception = assertThrows(InvalidDataException.class,
                () -> createCurrentMentorService.createCurrentMentor(command));

        assertEquals("Mentor profile already exists", exception.getMessage());
    }
}
