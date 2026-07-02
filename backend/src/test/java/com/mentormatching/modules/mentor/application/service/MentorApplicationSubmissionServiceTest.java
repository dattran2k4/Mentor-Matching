package com.mentormatching.modules.mentor.application.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.mentormatching.modules.mentor.application.dto.CurrentMentorOnboardingStatus;
import com.mentormatching.modules.mentor.application.port.in.GetCurrentMentorOnboardingStatusUseCase;
import com.mentormatching.modules.mentor.application.port.out.MentorProfileRepositoryPort;
import com.mentormatching.modules.mentor.application.port.out.MentorSubjectRepositoryPort;
import com.mentormatching.modules.mentor.application.port.out.MentorVerificationRepositoryPort;
import com.mentormatching.modules.mentor.domain.Gender;
import com.mentormatching.modules.mentor.domain.MeetingType;
import com.mentormatching.modules.mentor.domain.MentorApprovalStatus;
import com.mentormatching.modules.mentor.domain.MentorProfile;
import com.mentormatching.modules.mentor.domain.MentorProfileRestoreData;
import com.mentormatching.modules.mentor.domain.MentorSubject;
import com.mentormatching.modules.mentor.domain.MentorSubjectRestoreData;
import com.mentormatching.modules.mentor.domain.MentorVerificationStatus;
import com.mentormatching.modules.mentor.domain.ProficiencyLevel;
import com.mentormatching.shared.exception.InvalidDataException;

class MentorApplicationSubmissionServiceTest {

    private MentorProfileRepositoryPort mentorProfileRepositoryPort;
    private MentorVerificationRepositoryPort mentorVerificationRepositoryPort;
    private MentorSubjectRepositoryPort mentorSubjectRepositoryPort;
    private GetCurrentMentorOnboardingStatusUseCase getCurrentMentorOnboardingStatusUseCase;
    private MentorApplicationSubmissionService mentorApplicationSubmissionService;

    @BeforeEach
    void setUp() {
        mentorProfileRepositoryPort = mock(MentorProfileRepositoryPort.class);
        mentorVerificationRepositoryPort = mock(MentorVerificationRepositoryPort.class);
        mentorSubjectRepositoryPort = mock(MentorSubjectRepositoryPort.class);
        getCurrentMentorOnboardingStatusUseCase = mock(GetCurrentMentorOnboardingStatusUseCase.class);
        mentorApplicationSubmissionService = new MentorApplicationSubmissionService(mentorProfileRepositoryPort,
                mentorVerificationRepositoryPort, mentorSubjectRepositoryPort, getCurrentMentorOnboardingStatusUseCase);
    }

    @Test
    void submitCurrentMentorApplicationMovesDraftProfileToPendingWithPendingVerificationAndReturnsStatus() {
        MentorProfile mentorProfile = completeMentorProfile(MentorApprovalStatus.DRAFT);
        CurrentMentorOnboardingStatus expected = new CurrentMentorOnboardingStatus(true, true, true,
                MentorVerificationStatus.PENDING, 1, 0, 0, 0, MentorApprovalStatus.PENDING, false);

        when(mentorProfileRepositoryPort.findByUserId(20L)).thenReturn(Optional.of(mentorProfile));
        when(mentorVerificationRepositoryPort.existsByMentorId(10L)).thenReturn(true);
        when(mentorSubjectRepositoryPort.findByMentorId(10L)).thenReturn(List.of(activeSubject()));
        when(getCurrentMentorOnboardingStatusUseCase.getCurrentMentorOnboardingStatus(20L)).thenReturn(expected);

        CurrentMentorOnboardingStatus actual = mentorApplicationSubmissionService
                .submitCurrentMentorApplication(20L);

        assertEquals(expected, actual);
        assertEquals(MentorApprovalStatus.PENDING, mentorProfile.getApprovalStatus());
        verify(mentorProfileRepositoryPort).save(mentorProfile);
    }

    @Test
    void submitCurrentMentorApplicationThrowsWhenVerificationHasNotBeenSubmitted() {
        MentorProfile mentorProfile = completeMentorProfile(MentorApprovalStatus.DRAFT);

        when(mentorProfileRepositoryPort.findByUserId(20L)).thenReturn(Optional.of(mentorProfile));
        when(mentorVerificationRepositoryPort.existsByMentorId(10L)).thenReturn(false);

        InvalidDataException exception = assertThrows(InvalidDataException.class,
                () -> mentorApplicationSubmissionService.submitCurrentMentorApplication(20L));

        assertEquals("Mentor verification must be submitted before submission", exception.getMessage());
    }

    @Test
    void submitCurrentMentorApplicationThrowsWhenNoActiveSubjectExists() {
        MentorProfile mentorProfile = completeMentorProfile(MentorApprovalStatus.DRAFT);

        when(mentorProfileRepositoryPort.findByUserId(20L)).thenReturn(Optional.of(mentorProfile));
        when(mentorVerificationRepositoryPort.existsByMentorId(10L)).thenReturn(true);
        when(mentorSubjectRepositoryPort.findByMentorId(10L)).thenReturn(List.of(inactiveSubject()));

        InvalidDataException exception = assertThrows(InvalidDataException.class,
                () -> mentorApplicationSubmissionService.submitCurrentMentorApplication(20L));

        assertEquals("At least one active mentor subject is required before submission", exception.getMessage());
    }

    @Test
    void submitCurrentMentorApplicationThrowsWhenProfileDetailsAreIncomplete() {
        MentorProfile mentorProfile = MentorProfile.restore(new MentorProfileRestoreData(10L, 20L,
                "https://new.example.com/avatar.jpg", Gender.MALE, 11L, 22L, null,
                "New intro", "New style", 7, "New position", "New workplace", "New education",
                "New major", MeetingType.HYBRID, MentorApprovalStatus.DRAFT, null, null, null,
                LocalDateTime.parse("2026-06-01T10:15:30"), LocalDateTime.parse("2026-06-02T10:15:30")));

        when(mentorProfileRepositoryPort.findByUserId(20L)).thenReturn(Optional.of(mentorProfile));

        InvalidDataException exception = assertThrows(InvalidDataException.class,
                () -> mentorApplicationSubmissionService.submitCurrentMentorApplication(20L));

        assertEquals("Mentor profile details must be completed before submission", exception.getMessage());
    }

    private MentorProfile completeMentorProfile(MentorApprovalStatus approvalStatus) {
        return MentorProfile.restore(new MentorProfileRestoreData(10L, 20L,
                "https://new.example.com/avatar.jpg", Gender.MALE, 11L, 22L, "New headline",
                "New intro", "New style", 7, "New position", "New workplace", "New education",
                "New major", MeetingType.HYBRID, approvalStatus, null, null, null,
                LocalDateTime.parse("2026-06-01T10:15:30"), LocalDateTime.parse("2026-06-02T10:15:30")));
    }

    private MentorSubject activeSubject() {
        return MentorSubject.restore(new MentorSubjectRestoreData(1L, 10L, 101L, ProficiencyLevel.ADVANCED,
                null, BigDecimal.TEN, true, LocalDateTime.parse("2026-06-03T10:15:30"),
                LocalDateTime.parse("2026-06-03T10:15:30")));
    }

    private MentorSubject inactiveSubject() {
        return MentorSubject.restore(new MentorSubjectRestoreData(1L, 10L, 101L, ProficiencyLevel.ADVANCED,
                null, BigDecimal.TEN, false, LocalDateTime.parse("2026-06-03T10:15:30"),
                LocalDateTime.parse("2026-06-03T10:15:30")));
    }
}
