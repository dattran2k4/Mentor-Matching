package com.mentormatching.modules.mentor.application.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.mentormatching.modules.mentor.application.dto.CurrentMentorDetails;
import com.mentormatching.modules.mentor.application.dto.MentorAchievementDetail;
import com.mentormatching.modules.mentor.application.dto.MentorOptionDetail;
import com.mentormatching.modules.mentor.application.dto.MentorSubjectDetail;
import com.mentormatching.modules.mentor.application.port.out.MentorCatalogLookupPort;
import com.mentormatching.modules.mentor.application.port.out.MentorProfileRepositoryPort;
import com.mentormatching.modules.mentor.application.port.out.MentorReadRepositoryPort;
import com.mentormatching.modules.mentor.application.port.out.MentorSubjectRepositoryPort;
import com.mentormatching.modules.mentor.domain.Gender;
import com.mentormatching.modules.mentor.domain.AchievementType;
import com.mentormatching.modules.mentor.domain.MeetingType;
import com.mentormatching.modules.mentor.domain.MentorApprovalStatus;
import com.mentormatching.modules.mentor.domain.ProficiencyLevel;
import com.mentormatching.modules.mentor.domain.MentorProfile;
import com.mentormatching.modules.mentor.domain.MentorProfileRestoreData;
import com.mentormatching.modules.mentor.domain.MentorVerificationStatus;
import com.mentormatching.shared.exception.ResourceNotFoundException;

class MentorQueryServiceTest {

    private MentorProfileRepositoryPort mentorProfileRepositoryPort;
    private MentorReadRepositoryPort mentorReadRepositoryPort;
    private MentorQueryService mentorQueryService;

    @BeforeEach
    void setUp() {
        mentorProfileRepositoryPort = mock(MentorProfileRepositoryPort.class);
        MentorSubjectRepositoryPort mentorSubjectRepositoryPort = mock(MentorSubjectRepositoryPort.class);
        mentorReadRepositoryPort = mock(MentorReadRepositoryPort.class);
        MentorCatalogLookupPort mentorCatalogLookupPort = mock(MentorCatalogLookupPort.class);

        mentorQueryService = new MentorQueryService(mentorProfileRepositoryPort, mentorSubjectRepositoryPort,
                mentorReadRepositoryPort, mentorCatalogLookupPort);
    }

    @Test
    void getCurrentMentorReturnsCurrentMentorDetails() {
        CurrentMentorDetails expected = new CurrentMentorDetails(10L, 20L, "Nguyen Minh Anh",
                "https://example.com/avatar.jpg", Gender.FEMALE, 1L, "Ha Noi", 2L, "Ho Chi Minh City", 3L,
                "District 1", "Experienced Math Mentor", "Helping learners build confidence",
                "Concept-first with practice", 6, "Math Teacher", "Mentor Matching", "HCMUS", "Mathematics",
                MeetingType.HYBRID, MentorApprovalStatus.APPROVED, "Approved", MentorVerificationStatus.VERIFIED,
                null, LocalDateTime.parse("2026-06-01T10:15:30"), LocalDateTime.parse("2026-06-05T12:00:00"));
        MentorProfile mentorProfile = MentorProfile.restore(new MentorProfileRestoreData(10L, 20L,
                "https://example.com/avatar.jpg", Gender.FEMALE, 1L, 3L, "Experienced Math Mentor",
                "Helping learners build confidence", "Concept-first with practice", 6, "Math Teacher",
                "Mentor Matching", "HCMUS", "Mathematics", MeetingType.HYBRID, MentorApprovalStatus.APPROVED,
                "Approved", null, null, LocalDateTime.parse("2026-06-01T10:15:30"),
                LocalDateTime.parse("2026-06-05T12:00:00")));
        when(mentorProfileRepositoryPort.findByUserId(20L)).thenReturn(Optional.of(mentorProfile));
        when(mentorReadRepositoryPort.findCurrentMentorByMentorId(10L)).thenReturn(Optional.of(expected));

        CurrentMentorDetails actual = mentorQueryService.getCurrentMentor(20L);

        assertEquals(expected, actual);
    }

    @Test
    void getCurrentMentorThrowsWhenMentorProfileDoesNotExist() {
        when(mentorProfileRepositoryPort.findByUserId(99L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> mentorQueryService.getCurrentMentor(99L));

        assertEquals("Mentor profile not found", exception.getMessage());
    }

    @Test
    void getCurrentMentorSubjectsReturnsAllSubjectsIncludingInactiveOnes() {
        MentorProfile mentorProfile = MentorProfile.restore(new MentorProfileRestoreData(10L, 20L,
                "https://example.com/avatar.jpg", Gender.FEMALE, 1L, 2L, "Headline", "Intro",
                "Style", 6, "Teacher", "Mentor Matching", "HCMUS", "Mathematics", MeetingType.HYBRID,
                MentorApprovalStatus.PENDING, null, null, null, LocalDateTime.parse("2026-06-01T10:15:30"),
                LocalDateTime.parse("2026-06-05T12:00:00")));
        List<MentorSubjectDetail> expected = List.of(
                new MentorSubjectDetail(100L, 200L, 300L, "Toan", 400L, "Lop 9",
                        ProficiencyLevel.EXPERT, "Dang mo", new BigDecimal("250000"), true),
                new MentorSubjectDetail(101L, 201L, 301L, "Vat ly", 401L, "Lop 10",
                        ProficiencyLevel.INTERMEDIATE, "Tam an", new BigDecimal("220000"), false)
        );

        when(mentorProfileRepositoryPort.findByUserId(20L)).thenReturn(Optional.of(mentorProfile));
        when(mentorReadRepositoryPort.findAllMentorSubjects(10L)).thenReturn(expected);

        List<MentorSubjectDetail> actual = mentorQueryService.getCurrentMentorSubjects(20L);

        assertEquals(expected, actual);
    }

    @Test
    void getCurrentMentorSubjectsThrowsWhenMentorProfileDoesNotExist() {
        when(mentorProfileRepositoryPort.findByUserId(99L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> mentorQueryService.getCurrentMentorSubjects(99L));

        assertEquals("Mentor profile not found", exception.getMessage());
    }

    @Test
    void getCurrentMentorAchievementsReturnsAchievementsForCurrentMentor() {
        MentorProfile mentorProfile = MentorProfile.restore(new MentorProfileRestoreData(10L, 20L,
                "https://example.com/avatar.jpg", Gender.FEMALE, 1L, 2L, "Headline", "Intro",
                "Style", 6, "Teacher", "Mentor Matching", "HCMUS", "Mathematics", MeetingType.HYBRID,
                MentorApprovalStatus.PENDING, null, null, null, LocalDateTime.parse("2026-06-01T10:15:30"),
                LocalDateTime.parse("2026-06-05T12:00:00")));
        List<MentorAchievementDetail> expected = List.of(
                new MentorAchievementDetail(100L, "Giai nhat", "Dat giai cap thanh pho",
                        AchievementType.AWARD, "So Giao duc", LocalDate.parse("2024-05-10"),
                        "https://example.com/proof-1.jpg", true),
                new MentorAchievementDetail(101L, "Chung chi", "Hoan thanh khoa dao tao",
                        AchievementType.CERTIFICATE, "Coursera", LocalDate.parse("2023-11-01"),
                        "https://example.com/proof-2.jpg", false)
        );

        when(mentorProfileRepositoryPort.findByUserId(20L)).thenReturn(Optional.of(mentorProfile));
        when(mentorReadRepositoryPort.findMentorAchievements(10L)).thenReturn(expected);

        List<MentorAchievementDetail> actual = mentorQueryService.getCurrentMentorAchievements(20L);

        assertEquals(expected, actual);
    }

    @Test
    void getCurrentMentorAchievementsThrowsWhenMentorProfileDoesNotExist() {
        when(mentorProfileRepositoryPort.findByUserId(99L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> mentorQueryService.getCurrentMentorAchievements(99L));

        assertEquals("Mentor profile not found", exception.getMessage());
    }

    @Test
    void getPersonalityOptionsReturnsReadRepositoryResult() {
        List<MentorOptionDetail> expected = List.of(
                new MentorOptionDetail(1L, "Kiem nhan", "Binh tinh va dieu do"),
                new MentorOptionDetail(2L, "Truyen cam hung", "Tao dong luc hoc tap")
        );
        when(mentorReadRepositoryPort.findPersonalityOptions()).thenReturn(expected);

        List<MentorOptionDetail> actual = mentorQueryService.getPersonalityOptions();

        assertEquals(expected, actual);
    }

    @Test
    void getHighlightOptionsReturnsReadRepositoryResult() {
        List<MentorOptionDetail> expected = List.of(
                new MentorOptionDetail(1L, "Luyen thi", "Chuyen on thi"),
                new MentorOptionDetail(2L, "1 kem 1", "Ca nhan hoa lo trinh")
        );
        when(mentorReadRepositoryPort.findHighlightOptions()).thenReturn(expected);

        List<MentorOptionDetail> actual = mentorQueryService.getHighlightOptions();

        assertEquals(expected, actual);
    }
}
