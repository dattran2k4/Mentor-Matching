package com.mentormatching.modules.mentor.application.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.mentormatching.modules.mentor.application.dto.CurrentMentorVerificationDetails;
import com.mentormatching.modules.mentor.application.dto.MentorMediaAssetSummary;
import com.mentormatching.modules.mentor.application.dto.UpsertCurrentMentorVerificationCommand;
import com.mentormatching.modules.mentor.application.port.out.MentorMediaLookupPort;
import com.mentormatching.modules.mentor.application.port.out.MentorProfileRepositoryPort;
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

class MentorVerificationServiceTest {

    private MentorProfileRepositoryPort mentorProfileRepositoryPort;
    private MentorVerificationRepositoryPort mentorVerificationRepositoryPort;
    private MentorVerificationService mentorVerificationService;

    @BeforeEach
    void setUp() {
        mentorProfileRepositoryPort = mock(MentorProfileRepositoryPort.class);
        mentorVerificationRepositoryPort = mock(MentorVerificationRepositoryPort.class);
        mentorVerificationService = new MentorVerificationService(mentorProfileRepositoryPort,
                mentorVerificationRepositoryPort);
    }

    @Test
    void upsertCurrentMentorVerificationCreatesVerificationWhenItDoesNotExist() {
        MentorProfile mentorProfile = MentorProfile.restore(new MentorProfileRestoreData(10L, 20L,
                "https://avatar.example.com/mentor.jpg", Gender.FEMALE, 1L, 2L, "Headline", "Intro",
                "Style", 5, "Teacher", "School", "University", "Math", MeetingType.HYBRID,
                MentorApprovalStatus.APPROVED, null, null, null, LocalDateTime.parse("2026-06-01T10:00:00"),
                LocalDateTime.parse("2026-06-02T10:00:00")));
        UpsertCurrentMentorVerificationCommand command = new UpsertCurrentMentorVerificationCommand(20L,
                "Nguyen Minh Anh", "012345678901", "https://cdn.example.com/front.jpg",
                "https://cdn.example.com/back.jpg", "https://cdn.example.com/selfie.jpg");
        MentorVerification saved = MentorVerification.restore(new MentorVerificationRestoreData(30L, 10L,
                "Nguyen Minh Anh", "012345678901", "https://cdn.example.com/front.jpg",
                "https://cdn.example.com/back.jpg", "https://cdn.example.com/selfie.jpg",
                MentorVerificationStatus.PENDING, null, null, null, LocalDateTime.parse("2026-06-03T10:00:00"),
                LocalDateTime.parse("2026-06-04T10:00:00")));

        when(mentorProfileRepositoryPort.findByUserId(20L)).thenReturn(Optional.of(mentorProfile));
        when(mentorVerificationRepositoryPort.findByMentorId(10L)).thenReturn(Optional.empty());
        when(mentorVerificationRepositoryPort.save(org.mockito.ArgumentMatchers.any(MentorVerification.class)))
                .thenReturn(saved);

        CurrentMentorVerificationDetails actual = mentorVerificationService.upsertCurrentMentorVerification(command);

        assertEquals(30L, actual.id());
        assertEquals(10L, actual.mentorId());
        assertEquals("PENDING", actual.verificationStatus());
        assertEquals("Nguyen Minh Anh", actual.fullName());
    }

    @Test
    void upsertCurrentMentorVerificationResetsStatusWhenVerificationAlreadyExists() {
        MentorProfile mentorProfile = MentorProfile.restore(new MentorProfileRestoreData(10L, 20L,
                "https://avatar.example.com/mentor.jpg", Gender.FEMALE, 1L, 2L, "Headline", "Intro",
                "Style", 5, "Teacher", "School", "University", "Math", MeetingType.HYBRID,
                MentorApprovalStatus.APPROVED, null, null, null, LocalDateTime.parse("2026-06-01T10:00:00"),
                LocalDateTime.parse("2026-06-02T10:00:00")));
        MentorVerification existing = MentorVerification.restore(new MentorVerificationRestoreData(30L, 10L,
                "Old Name", "999", "https://cdn.example.com/old-front.jpg",
                "https://cdn.example.com/old-back.jpg", null, MentorVerificationStatus.REJECTED, 100L,
                LocalDateTime.parse("2026-06-05T10:00:00"), "Blurred photo",
                LocalDateTime.parse("2026-06-03T10:00:00"), LocalDateTime.parse("2026-06-05T10:00:00")));
        UpsertCurrentMentorVerificationCommand command = new UpsertCurrentMentorVerificationCommand(20L,
                "Nguyen Minh Anh", "012345678901", "https://cdn.example.com/front.jpg",
                "https://cdn.example.com/back.jpg", "https://cdn.example.com/selfie.jpg");

        when(mentorProfileRepositoryPort.findByUserId(20L)).thenReturn(Optional.of(mentorProfile));
        when(mentorVerificationRepositoryPort.findByMentorId(10L)).thenReturn(Optional.of(existing));
        when(mentorVerificationRepositoryPort.save(existing)).thenReturn(existing);

        CurrentMentorVerificationDetails actual = mentorVerificationService.upsertCurrentMentorVerification(command);

        assertEquals(30L, actual.id());
        assertEquals("PENDING", actual.verificationStatus());
        assertEquals("Nguyen Minh Anh", actual.fullName());
        assertEquals("012345678901", actual.idCardNumber());
        assertNull(actual.verifiedBy());
        assertNull(actual.verifiedAt());
        assertNull(actual.rejectionReason());
    }

    @Test
    void upsertCurrentMentorVerificationThrowsWhenMentorProfileDoesNotExist() {
        UpsertCurrentMentorVerificationCommand command = new UpsertCurrentMentorVerificationCommand(99L,
                "Nguyen Minh Anh", "012345678901", "https://cdn.example.com/front.jpg",
                "https://cdn.example.com/back.jpg", "https://cdn.example.com/selfie.jpg");

        when(mentorProfileRepositoryPort.findByUserId(99L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> mentorVerificationService.upsertCurrentMentorVerification(command));

        assertEquals("Mentor profile not found", exception.getMessage());
    }

    @Test
    void upsertCurrentMentorVerificationCreatesVerificationFromMediaIds() {
        MentorMediaLookupPort mentorMediaLookupPort = mock(MentorMediaLookupPort.class);
        mentorVerificationService = new MentorVerificationService(mentorProfileRepositoryPort,
                mentorVerificationRepositoryPort, mentorMediaLookupPort);
        MentorProfile mentorProfile = buildMentorProfile();
        UpsertCurrentMentorVerificationCommand command = new UpsertCurrentMentorVerificationCommand(20L,
                "Nguyen Minh Anh", "012345678901", 101L, 102L, 103L, null, null, null);
        MentorVerification saved = MentorVerification.restore(new MentorVerificationRestoreData(30L, 10L,
                "Nguyen Minh Anh", "012345678901", "https://cdn.example.com/front.jpg", 101L,
                "https://cdn.example.com/back.jpg", 102L, "https://cdn.example.com/selfie.jpg", 103L,
                MentorVerificationStatus.PENDING, null, null, null, LocalDateTime.parse("2026-06-03T10:00:00"),
                LocalDateTime.parse("2026-06-04T10:00:00")));

        when(mentorProfileRepositoryPort.findByUserId(20L)).thenReturn(Optional.of(mentorProfile));
        when(mentorVerificationRepositoryPort.findByMentorId(10L)).thenReturn(Optional.empty());
        when(mentorMediaLookupPort.getMediaAsset(101L)).thenReturn(verificationMedia(101L,
                "https://cdn.example.com/front.jpg", 20L, "VERIFICATION"));
        when(mentorMediaLookupPort.getMediaAsset(102L)).thenReturn(verificationMedia(102L,
                "https://cdn.example.com/back.jpg", 20L, "VERIFICATION"));
        when(mentorMediaLookupPort.getMediaAsset(103L)).thenReturn(verificationMedia(103L,
                "https://cdn.example.com/selfie.jpg", 20L, "VERIFICATION"));
        when(mentorVerificationRepositoryPort.save(any(MentorVerification.class))).thenReturn(saved);

        CurrentMentorVerificationDetails actual = mentorVerificationService.upsertCurrentMentorVerification(command);

        assertEquals(101L, actual.idCardFrontMediaId());
        assertEquals(102L, actual.idCardBackMediaId());
        assertEquals(103L, actual.selfieWithIdMediaId());
        assertEquals("https://cdn.example.com/front.jpg", actual.idCardFrontUrl());
    }

    @Test
    void upsertCurrentMentorVerificationThrowsWhenVerificationMediaBelongsToAnotherUser() {
        MentorMediaLookupPort mentorMediaLookupPort = mock(MentorMediaLookupPort.class);
        mentorVerificationService = new MentorVerificationService(mentorProfileRepositoryPort,
                mentorVerificationRepositoryPort, mentorMediaLookupPort);
        UpsertCurrentMentorVerificationCommand command = new UpsertCurrentMentorVerificationCommand(20L,
                "Nguyen Minh Anh", "012345678901", 101L, 102L, null, null, null, null);

        when(mentorProfileRepositoryPort.findByUserId(20L)).thenReturn(Optional.of(buildMentorProfile()));
        when(mentorMediaLookupPort.getMediaAsset(101L)).thenReturn(verificationMedia(101L,
                "https://cdn.example.com/front.jpg", 999L, "VERIFICATION"));

        InvalidDataException exception = assertThrows(InvalidDataException.class,
                () -> mentorVerificationService.upsertCurrentMentorVerification(command));

        assertEquals("You are not authorized to use ID card front media", exception.getMessage());
    }

    @Test
    void upsertCurrentMentorVerificationThrowsWhenMediaPurposeIsNotVerification() {
        MentorMediaLookupPort mentorMediaLookupPort = mock(MentorMediaLookupPort.class);
        mentorVerificationService = new MentorVerificationService(mentorProfileRepositoryPort,
                mentorVerificationRepositoryPort, mentorMediaLookupPort);
        UpsertCurrentMentorVerificationCommand command = new UpsertCurrentMentorVerificationCommand(20L,
                "Nguyen Minh Anh", "012345678901", 101L, 102L, null, null, null, null);

        when(mentorProfileRepositoryPort.findByUserId(20L)).thenReturn(Optional.of(buildMentorProfile()));
        when(mentorMediaLookupPort.getMediaAsset(101L)).thenReturn(verificationMedia(101L,
                "https://cdn.example.com/front.jpg", 20L, "AVATAR"));

        InvalidDataException exception = assertThrows(InvalidDataException.class,
                () -> mentorVerificationService.upsertCurrentMentorVerification(command));

        assertEquals("ID card front media purpose must be verification", exception.getMessage());
    }

    @Test
    void upsertCurrentMentorVerificationThrowsWhenExistingVerificationIsPending() {
        MentorVerification existing = MentorVerification.restore(new MentorVerificationRestoreData(30L, 10L,
                "Old Name", "999", "https://cdn.example.com/old-front.jpg",
                "https://cdn.example.com/old-back.jpg", null, MentorVerificationStatus.PENDING, null,
                null, null, LocalDateTime.parse("2026-06-03T10:00:00"),
                LocalDateTime.parse("2026-06-05T10:00:00")));
        UpsertCurrentMentorVerificationCommand command = new UpsertCurrentMentorVerificationCommand(20L,
                "Nguyen Minh Anh", "012345678901", "https://cdn.example.com/front.jpg",
                "https://cdn.example.com/back.jpg", "https://cdn.example.com/selfie.jpg");

        when(mentorProfileRepositoryPort.findByUserId(20L)).thenReturn(Optional.of(buildMentorProfile()));
        when(mentorVerificationRepositoryPort.findByMentorId(10L)).thenReturn(Optional.of(existing));

        InvalidDataException exception = assertThrows(InvalidDataException.class,
                () -> mentorVerificationService.upsertCurrentMentorVerification(command));

        assertEquals("Pending verification cannot be updated", exception.getMessage());
    }

    @Test
    void upsertCurrentMentorVerificationThrowsWhenExistingVerificationIsVerified() {
        MentorVerification existing = MentorVerification.restore(new MentorVerificationRestoreData(30L, 10L,
                "Old Name", "999", "https://cdn.example.com/old-front.jpg",
                "https://cdn.example.com/old-back.jpg", null, MentorVerificationStatus.VERIFIED, 100L,
                LocalDateTime.parse("2026-06-06T10:00:00"), null,
                LocalDateTime.parse("2026-06-03T10:00:00"), LocalDateTime.parse("2026-06-06T10:00:00")));
        UpsertCurrentMentorVerificationCommand command = new UpsertCurrentMentorVerificationCommand(20L,
                "Nguyen Minh Anh", "012345678901", "https://cdn.example.com/front.jpg",
                "https://cdn.example.com/back.jpg", "https://cdn.example.com/selfie.jpg");

        when(mentorProfileRepositoryPort.findByUserId(20L)).thenReturn(Optional.of(buildMentorProfile()));
        when(mentorVerificationRepositoryPort.findByMentorId(10L)).thenReturn(Optional.of(existing));

        InvalidDataException exception = assertThrows(InvalidDataException.class,
                () -> mentorVerificationService.upsertCurrentMentorVerification(command));

        assertEquals("Verified verification cannot be updated", exception.getMessage());
    }

    private MentorProfile buildMentorProfile() {
        return MentorProfile.restore(new MentorProfileRestoreData(10L, 20L,
                "https://avatar.example.com/mentor.jpg", Gender.FEMALE, 1L, 2L, "Headline", "Intro",
                "Style", 5, "Teacher", "School", "University", "Math", MeetingType.HYBRID,
                MentorApprovalStatus.APPROVED, null, null, null, LocalDateTime.parse("2026-06-01T10:00:00"),
                LocalDateTime.parse("2026-06-02T10:00:00")));
    }

    private MentorMediaAssetSummary verificationMedia(Long id, String deliveryUrl, Long uploadedByUserId,
                                                      String purpose) {
        return new MentorMediaAssetSummary(id, deliveryUrl, "IMAGE", "PRIVATE", purpose, "READY",
                uploadedByUserId);
    }
}
