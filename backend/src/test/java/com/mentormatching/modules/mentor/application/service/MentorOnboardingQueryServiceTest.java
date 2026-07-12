package com.mentormatching.modules.mentor.application.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.mentormatching.modules.mentor.application.dto.CurrentMentorOnboardingStatus;
import com.mentormatching.modules.mentor.application.dto.MentorAchievementDetail;
import com.mentormatching.modules.mentor.domain.AchievementType;
import com.mentormatching.modules.mentor.application.port.out.MentorHighlightRepositoryPort;
import com.mentormatching.modules.mentor.application.port.out.MentorPersonalityRepositoryPort;
import com.mentormatching.modules.mentor.application.port.out.MentorProfileRepositoryPort;
import com.mentormatching.modules.mentor.application.port.out.MentorReadRepositoryPort;
import com.mentormatching.modules.mentor.application.port.out.MentorSubjectRepositoryPort;
import com.mentormatching.modules.mentor.application.port.out.MentorVerificationRepositoryPort;
import com.mentormatching.modules.mentor.domain.Gender;
import com.mentormatching.modules.mentor.domain.MeetingType;
import com.mentormatching.modules.mentor.domain.MentorApprovalStatus;
import com.mentormatching.modules.mentor.domain.MentorHighlight;
import com.mentormatching.modules.mentor.domain.MentorPersonality;
import com.mentormatching.modules.mentor.domain.MentorProfile;
import com.mentormatching.modules.mentor.domain.MentorProfileRestoreData;
import com.mentormatching.modules.mentor.domain.MentorSubject;
import com.mentormatching.modules.mentor.domain.MentorSubjectRestoreData;
import com.mentormatching.modules.mentor.domain.MentorVerification;
import com.mentormatching.modules.mentor.domain.MentorVerificationRestoreData;
import com.mentormatching.modules.mentor.domain.MentorVerificationStatus;
import com.mentormatching.modules.mentor.domain.ProficiencyLevel;

class MentorOnboardingQueryServiceTest {

    private MentorProfileRepositoryPort mentorProfileRepositoryPort;
    private MentorVerificationRepositoryPort mentorVerificationRepositoryPort;
    private MentorSubjectRepositoryPort mentorSubjectRepositoryPort;
    private MentorPersonalityRepositoryPort mentorPersonalityRepositoryPort;
    private MentorHighlightRepositoryPort mentorHighlightRepositoryPort;
    private MentorReadRepositoryPort mentorReadRepositoryPort;
    private MentorOnboardingQueryService mentorOnboardingQueryService;

    @BeforeEach
    void setUp() {
        mentorProfileRepositoryPort = mock(MentorProfileRepositoryPort.class);
        mentorVerificationRepositoryPort = mock(MentorVerificationRepositoryPort.class);
        mentorSubjectRepositoryPort = mock(MentorSubjectRepositoryPort.class);
        mentorPersonalityRepositoryPort = mock(MentorPersonalityRepositoryPort.class);
        mentorHighlightRepositoryPort = mock(MentorHighlightRepositoryPort.class);
        mentorReadRepositoryPort = mock(MentorReadRepositoryPort.class);
        mentorOnboardingQueryService = new MentorOnboardingQueryService(mentorProfileRepositoryPort,
                mentorVerificationRepositoryPort, mentorSubjectRepositoryPort, mentorPersonalityRepositoryPort,
                mentorHighlightRepositoryPort, mentorReadRepositoryPort);
    }

    @Test
    void getCurrentMentorOnboardingStatusReturnsDefaultStatusWhenProfileDoesNotExist() {
        when(mentorProfileRepositoryPort.findByUserId(99L)).thenReturn(Optional.empty());

        CurrentMentorOnboardingStatus actual = mentorOnboardingQueryService.getCurrentMentorOnboardingStatus(99L);

        assertFalse(actual.mentorProfileCreated());
        assertFalse(actual.profileDetailsCompleted());
        assertFalse(actual.verificationSubmitted());
        assertNull(actual.verificationStatus());
        assertEquals(0, actual.subjectCount());
        assertEquals(0, actual.personalityCount());
        assertEquals(0, actual.highlightCount());
        assertEquals(0, actual.achievementCount());
        assertNull(actual.approvalStatus());
        assertFalse(actual.onboardingCompleted());
    }

    @Test
    void getCurrentMentorOnboardingStatusAggregatesExistingOnboardingData() {
        MentorProfile mentorProfile = MentorProfile.restore(new MentorProfileRestoreData(10L, 20L,
                "https://new.example.com/avatar.jpg", Gender.MALE, 11L, 22L, "New headline",
                "New intro", "New style", 7, "New position", "New workplace", "New education",
                "New major", MeetingType.HYBRID, MentorApprovalStatus.PENDING, null, null, null,
                LocalDateTime.parse("2026-06-01T10:15:30"), LocalDateTime.parse("2026-06-02T10:15:30")));
        MentorVerification verification = MentorVerification.restore(new MentorVerificationRestoreData(40L, 10L,
                "Nguyen Minh Anh", "012345678901", "front.jpg", "back.jpg", "selfie.jpg",
                MentorVerificationStatus.PENDING, null, null, null,
                LocalDateTime.parse("2026-06-03T10:15:30"), LocalDateTime.parse("2026-06-03T10:15:30")));

        when(mentorProfileRepositoryPort.findByUserId(20L)).thenReturn(Optional.of(mentorProfile));
        when(mentorVerificationRepositoryPort.findByMentorId(10L)).thenReturn(Optional.of(verification));
        when(mentorSubjectRepositoryPort.findByMentorId(10L)).thenReturn(List.of(
                MentorSubject.restore(new MentorSubjectRestoreData(1L, 10L, 101L, ProficiencyLevel.ADVANCED, null,
                        java.math.BigDecimal.TEN, true,
                        LocalDateTime.parse("2026-06-03T10:15:30"), LocalDateTime.parse("2026-06-03T10:15:30"))),
                MentorSubject.restore(new MentorSubjectRestoreData(2L, 10L, 102L, ProficiencyLevel.INTERMEDIATE,
                        null, java.math.BigDecimal.ONE, true,
                        LocalDateTime.parse("2026-06-03T10:15:30"), LocalDateTime.parse("2026-06-03T10:15:30")))
        ));
        when(mentorPersonalityRepositoryPort.findByMentorId(10L)).thenReturn(List.of(
                MentorPersonality.create(10L, 1L), MentorPersonality.create(10L, 2L)
        ));
        when(mentorHighlightRepositoryPort.findByMentorId(10L)).thenReturn(List.of(
                MentorHighlight.create(10L, 3L)
        ));
        when(mentorReadRepositoryPort.findMentorAchievements(10L)).thenReturn(List.of(
                new MentorAchievementDetail(100L, "Scholarship", "Won national scholarship",
                        AchievementType.AWARD, "MOET", LocalDateTime.parse("2026-05-20T00:00:00").toLocalDate(),
                        null, true)
        ));

        CurrentMentorOnboardingStatus actual = mentorOnboardingQueryService.getCurrentMentorOnboardingStatus(20L);

        assertTrue(actual.mentorProfileCreated());
        assertTrue(actual.profileDetailsCompleted());
        assertTrue(actual.verificationSubmitted());
        assertEquals(MentorVerificationStatus.PENDING, actual.verificationStatus());
        assertEquals(2, actual.subjectCount());
        assertEquals(2, actual.personalityCount());
        assertEquals(1, actual.highlightCount());
        assertEquals(1, actual.achievementCount());
        assertEquals(MentorApprovalStatus.PENDING, actual.approvalStatus());
        assertFalse(actual.onboardingCompleted());
    }
}
