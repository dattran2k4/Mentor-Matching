package com.mentormatching.modules.mentor.application.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.mentormatching.modules.mentor.application.dto.AdminMentorDetail;
import com.mentormatching.modules.mentor.application.dto.ReviewMentorApprovalAction;
import com.mentormatching.modules.mentor.application.dto.ReviewMentorApprovalCommand;
import com.mentormatching.modules.mentor.application.port.out.MentorProfileRepositoryPort;
import com.mentormatching.modules.mentor.application.port.out.MentorReadRepositoryPort;
import com.mentormatching.modules.mentor.application.port.out.MentorVerificationRepositoryPort;
import com.mentormatching.modules.mentor.domain.Gender;
import com.mentormatching.modules.mentor.domain.MeetingType;
import com.mentormatching.modules.mentor.domain.MentorApprovalStatus;
import com.mentormatching.modules.mentor.domain.MentorProfile;
import com.mentormatching.modules.mentor.domain.MentorProfileRestoreData;
import com.mentormatching.modules.mentor.domain.MentorVerification;
import com.mentormatching.modules.mentor.domain.MentorVerificationRestoreData;
import com.mentormatching.modules.mentor.domain.MentorVerificationStatus;
import com.mentormatching.shared.exception.InvalidDataException;
import com.mentormatching.shared.exception.ResourceNotFoundException;

class AdminMentorApprovalServiceTest {

    private MentorProfileRepositoryPort mentorProfileRepositoryPort;
    private MentorReadRepositoryPort mentorReadRepositoryPort;
    private MentorVerificationRepositoryPort mentorVerificationRepositoryPort;
    private AdminMentorApprovalService adminMentorApprovalService;

    @BeforeEach
    void setUp() {
        mentorProfileRepositoryPort = mock(MentorProfileRepositoryPort.class);
        mentorReadRepositoryPort = mock(MentorReadRepositoryPort.class);
        mentorVerificationRepositoryPort = mock(MentorVerificationRepositoryPort.class);
        adminMentorApprovalService = new AdminMentorApprovalService(mentorProfileRepositoryPort,
                mentorReadRepositoryPort, mentorVerificationRepositoryPort);
    }

    @Test
    void reviewMentorApprovalApprovesPendingProfileWhenVerificationIsVerified() {
        ReviewMentorApprovalCommand command = new ReviewMentorApprovalCommand(99L, 10L,
                ReviewMentorApprovalAction.APPROVE, "  Ready to publish  ");
        MentorProfile mentorProfile = pendingMentorProfile();
        MentorVerification verification = verifiedVerification();
        AdminMentorDetail expected = approvedDetail();

        when(mentorProfileRepositoryPort.findById(10L)).thenReturn(Optional.of(mentorProfile));
        when(mentorVerificationRepositoryPort.findByMentorId(10L)).thenReturn(Optional.of(verification));
        when(mentorProfileRepositoryPort.save(mentorProfile)).thenReturn(mentorProfile);
        when(mentorReadRepositoryPort.findAdminMentorDetailById(10L)).thenReturn(Optional.of(expected));

        AdminMentorDetail actual = adminMentorApprovalService.reviewMentorApproval(command);

        assertSame(expected, actual);
        assertEquals(MentorApprovalStatus.APPROVED, mentorProfile.getApprovalStatus());
        assertEquals("Ready to publish", mentorProfile.getApprovalNote());
        assertEquals(99L, mentorProfile.getApprovedBy());
        verify(mentorProfileRepositoryPort).save(mentorProfile);
    }

    @Test
    void reviewMentorApprovalRejectsPendingProfile() {
        ReviewMentorApprovalCommand command = new ReviewMentorApprovalCommand(99L, 10L,
                ReviewMentorApprovalAction.REJECT, "  Missing teaching intro  ");
        MentorProfile mentorProfile = pendingMentorProfile();
        AdminMentorDetail expected = rejectedDetail();

        when(mentorProfileRepositoryPort.findById(10L)).thenReturn(Optional.of(mentorProfile));
        when(mentorProfileRepositoryPort.save(mentorProfile)).thenReturn(mentorProfile);
        when(mentorReadRepositoryPort.findAdminMentorDetailById(10L)).thenReturn(Optional.of(expected));

        AdminMentorDetail actual = adminMentorApprovalService.reviewMentorApproval(command);

        assertSame(expected, actual);
        assertEquals(MentorApprovalStatus.REJECTED, mentorProfile.getApprovalStatus());
        assertEquals("Missing teaching intro", mentorProfile.getApprovalNote());
        verify(mentorVerificationRepositoryPort, never()).findByMentorId(10L);
        verify(mentorProfileRepositoryPort).save(mentorProfile);
    }

    @Test
    void reviewMentorApprovalThrowsWhenVerificationIsNotVerified() {
        ReviewMentorApprovalCommand command = new ReviewMentorApprovalCommand(99L, 10L,
                ReviewMentorApprovalAction.APPROVE, null);
        MentorProfile mentorProfile = pendingMentorProfile();
        MentorVerification verification = pendingVerification();

        when(mentorProfileRepositoryPort.findById(10L)).thenReturn(Optional.of(mentorProfile));
        when(mentorVerificationRepositoryPort.findByMentorId(10L)).thenReturn(Optional.of(verification));

        InvalidDataException exception = assertThrows(InvalidDataException.class,
                () -> adminMentorApprovalService.reviewMentorApproval(command));

        assertEquals("Mentor verification must be verified before approval", exception.getMessage());
        verify(mentorProfileRepositoryPort, never()).save(mentorProfile);
    }

    @Test
    void reviewMentorApprovalThrowsWhenApprovalNoteIsMissingForReject() {
        ReviewMentorApprovalCommand command = new ReviewMentorApprovalCommand(99L, 10L,
                ReviewMentorApprovalAction.REJECT, "   ");
        MentorProfile mentorProfile = pendingMentorProfile();

        when(mentorProfileRepositoryPort.findById(10L)).thenReturn(Optional.of(mentorProfile));

        InvalidDataException exception = assertThrows(InvalidDataException.class,
                () -> adminMentorApprovalService.reviewMentorApproval(command));

        assertEquals("Approval note is required when rejecting mentor", exception.getMessage());
    }

    @Test
    void reviewMentorApprovalThrowsWhenProfileIsNotPending() {
        ReviewMentorApprovalCommand command = new ReviewMentorApprovalCommand(99L, 10L,
                ReviewMentorApprovalAction.APPROVE, null);
        MentorProfile mentorProfile = approvedMentorProfile();
        MentorVerification verification = verifiedVerification();

        when(mentorProfileRepositoryPort.findById(10L)).thenReturn(Optional.of(mentorProfile));
        when(mentorVerificationRepositoryPort.findByMentorId(10L)).thenReturn(Optional.of(verification));

        InvalidDataException exception = assertThrows(InvalidDataException.class,
                () -> adminMentorApprovalService.reviewMentorApproval(command));

        assertEquals("Only pending mentor profile can be reviewed", exception.getMessage());
    }

    @Test
    void reviewMentorApprovalSuspendsApprovedProfile() {
        ReviewMentorApprovalCommand command = new ReviewMentorApprovalCommand(99L, 10L,
                ReviewMentorApprovalAction.SUSPEND, "  Violates policy  ");
        MentorProfile mentorProfile = approvedMentorProfile();
        AdminMentorDetail expected = rejectedDetail();

        when(mentorProfileRepositoryPort.findById(10L)).thenReturn(Optional.of(mentorProfile));
        when(mentorProfileRepositoryPort.save(mentorProfile)).thenReturn(mentorProfile);
        when(mentorReadRepositoryPort.findAdminMentorDetailById(10L)).thenReturn(Optional.of(expected));

        AdminMentorDetail actual = adminMentorApprovalService.reviewMentorApproval(command);

        assertSame(expected, actual);
        assertEquals(MentorApprovalStatus.SUSPENDED, mentorProfile.getApprovalStatus());
        assertEquals("Violates policy", mentorProfile.getApprovalNote());
        verify(mentorProfileRepositoryPort).save(mentorProfile);
    }

    @Test
    void reviewMentorApprovalThrowsWhenSuspendingNonApprovedProfile() {
        ReviewMentorApprovalCommand command = new ReviewMentorApprovalCommand(99L, 10L,
                ReviewMentorApprovalAction.SUSPEND, "Violates policy");
        MentorProfile mentorProfile = pendingMentorProfile();

        when(mentorProfileRepositoryPort.findById(10L)).thenReturn(Optional.of(mentorProfile));

        InvalidDataException exception = assertThrows(InvalidDataException.class,
                () -> adminMentorApprovalService.reviewMentorApproval(command));

        assertEquals("Only approved mentor profile can be suspended", exception.getMessage());
    }

    @Test
    void reviewMentorApprovalReactivatesSuspendedProfile() {
        ReviewMentorApprovalCommand command = new ReviewMentorApprovalCommand(99L, 10L,
                ReviewMentorApprovalAction.REACTIVATE, null);
        MentorProfile mentorProfile = suspendedMentorProfile();
        AdminMentorDetail expected = approvedDetail();

        when(mentorProfileRepositoryPort.findById(10L)).thenReturn(Optional.of(mentorProfile));
        when(mentorProfileRepositoryPort.save(mentorProfile)).thenReturn(mentorProfile);
        when(mentorReadRepositoryPort.findAdminMentorDetailById(10L)).thenReturn(Optional.of(expected));

        AdminMentorDetail actual = adminMentorApprovalService.reviewMentorApproval(command);

        assertSame(expected, actual);
        assertEquals(MentorApprovalStatus.APPROVED, mentorProfile.getApprovalStatus());
        verify(mentorProfileRepositoryPort).save(mentorProfile);
    }

    @Test
    void reviewMentorApprovalThrowsWhenReactivatingNonSuspendedProfile() {
        ReviewMentorApprovalCommand command = new ReviewMentorApprovalCommand(99L, 10L,
                ReviewMentorApprovalAction.REACTIVATE, null);
        MentorProfile mentorProfile = approvedMentorProfile();

        when(mentorProfileRepositoryPort.findById(10L)).thenReturn(Optional.of(mentorProfile));

        InvalidDataException exception = assertThrows(InvalidDataException.class,
                () -> adminMentorApprovalService.reviewMentorApproval(command));

        assertEquals("Only suspended mentor profile can be reactivated", exception.getMessage());
    }

    @Test
    void reviewMentorApprovalThrowsWhenMentorProfileDoesNotExist() {
        ReviewMentorApprovalCommand command = new ReviewMentorApprovalCommand(99L, 10L,
                ReviewMentorApprovalAction.APPROVE, null);

        when(mentorProfileRepositoryPort.findById(10L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> adminMentorApprovalService.reviewMentorApproval(command));

        assertEquals("Mentor profile not found", exception.getMessage());
    }

    private MentorProfile pendingMentorProfile() {
        return MentorProfile.restore(new MentorProfileRestoreData(10L, 20L, "https://example.com/avatar.jpg",
                Gender.FEMALE, 1L, 3L, "Headline", "Intro", "Style", 6, "Teacher", "Mentor Matching", "HCMUS",
                "Mathematics", MeetingType.HYBRID, MentorApprovalStatus.PENDING, null, null, null,
                LocalDateTime.parse("2026-06-01T10:15:30"), LocalDateTime.parse("2026-06-05T12:00:00")));
    }

    private MentorProfile approvedMentorProfile() {
        return MentorProfile.restore(new MentorProfileRestoreData(10L, 20L, "https://example.com/avatar.jpg",
                Gender.FEMALE, 1L, 3L, "Headline", "Intro", "Style", 6, "Teacher", "Mentor Matching", "HCMUS",
                "Mathematics", MeetingType.HYBRID, MentorApprovalStatus.APPROVED, "Approved", 99L,
                LocalDateTime.parse("2026-06-06T09:00:00"), LocalDateTime.parse("2026-06-01T10:15:30"),
                LocalDateTime.parse("2026-06-06T09:00:00")));
    }

    private MentorProfile suspendedMentorProfile() {
        return MentorProfile.restore(new MentorProfileRestoreData(10L, 20L, "https://example.com/avatar.jpg",
                Gender.FEMALE, 1L, 3L, "Headline", "Intro", "Style", 6, "Teacher", "Mentor Matching", "HCMUS",
                "Mathematics", MeetingType.HYBRID, MentorApprovalStatus.SUSPENDED, "Violates policy", 99L,
                LocalDateTime.parse("2026-06-06T09:00:00"), LocalDateTime.parse("2026-06-01T10:15:30"),
                LocalDateTime.parse("2026-06-07T09:00:00")));
    }

    private MentorVerification verifiedVerification() {
        return MentorVerification.restore(new MentorVerificationRestoreData(30L, 10L, "Nguyen Minh Anh",
                "012345678901", "https://cdn.example.com/front.jpg", "https://cdn.example.com/back.jpg",
                "https://cdn.example.com/selfie.jpg", MentorVerificationStatus.VERIFIED, 88L,
                LocalDateTime.parse("2026-06-04T08:00:00"), null, LocalDateTime.parse("2026-06-03T10:00:00"),
                LocalDateTime.parse("2026-06-04T08:00:00")));
    }

    private MentorVerification pendingVerification() {
        return MentorVerification.restore(new MentorVerificationRestoreData(30L, 10L, "Nguyen Minh Anh",
                "012345678901", "https://cdn.example.com/front.jpg", "https://cdn.example.com/back.jpg",
                "https://cdn.example.com/selfie.jpg", MentorVerificationStatus.PENDING, null, null, null,
                LocalDateTime.parse("2026-06-03T10:00:00"), LocalDateTime.parse("2026-06-04T08:00:00")));
    }

    private AdminMentorDetail approvedDetail() {
        return new AdminMentorDetail(10L, 20L, "Nguyen Minh Anh", "mentor@example.com", "0900000002",
                "https://example.com/avatar.jpg", Gender.FEMALE, 1L, "Ha Noi", 2L, "Ho Chi Minh City", 3L,
                "District 1", "Headline", "Intro", "Style", 6, "Teacher", "Mentor Matching", "HCMUS",
                "Mathematics", MeetingType.HYBRID, MentorApprovalStatus.APPROVED, "Ready to publish",
                LocalDateTime.parse("2026-06-01T10:15:30"), LocalDateTime.parse("2026-06-06T09:00:00"));
    }

    private AdminMentorDetail rejectedDetail() {
        return new AdminMentorDetail(10L, 20L, "Nguyen Minh Anh", "mentor@example.com", "0900000002",
                "https://example.com/avatar.jpg", Gender.FEMALE, 1L, "Ha Noi", 2L, "Ho Chi Minh City", 3L,
                "District 1", "Headline", "Intro", "Style", 6, "Teacher", "Mentor Matching", "HCMUS",
                "Mathematics", MeetingType.HYBRID, MentorApprovalStatus.REJECTED, "Missing teaching intro",
                LocalDateTime.parse("2026-06-01T10:15:30"), LocalDateTime.parse("2026-06-06T09:00:00"));
    }
}
