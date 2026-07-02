package com.mentormatching.modules.mentor.domain;

import java.time.LocalDateTime;

import com.mentormatching.shared.exception.InvalidDataException;

public class MentorProfile {

    private final Long id;
    private final Long userId;
    private String avatarUrl;
    private Long avatarMediaId;
    private Gender gender;
    private Long hometownCityId;
    private Long currentDistrictId;
    private String headline;
    private String introduction;
    private String teachingStyle;
    private Integer experienceYears;
    private String currentPosition;
    private String workplace;
    private String education;
    private String major;
    private MeetingType meetingType;
    private MentorApprovalStatus approvalStatus;
    private String approvalNote;
    private Long approvedBy;
    private LocalDateTime approvedAt;
    private final LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private MentorProfile(MentorProfileRestoreData data) {
        this.id = data.id();
        this.userId = data.userId();
        this.avatarUrl = data.avatarUrl();
        this.avatarMediaId = data.avatarMediaId();
        this.gender = data.gender();
        this.hometownCityId = data.hometownCityId();
        this.currentDistrictId = data.currentDistrictId();
        this.headline = data.headline();
        this.introduction = data.introduction();
        this.teachingStyle = data.teachingStyle();
        this.experienceYears = data.experienceYears();
        this.currentPosition = data.currentPosition();
        this.workplace = data.workplace();
        this.education = data.education();
        this.major = data.major();
        this.meetingType = data.meetingType();
        this.approvalStatus = data.approvalStatus();
        this.approvalNote = data.approvalNote();
        this.approvedBy = data.approvedBy();
        this.approvedAt = data.approvedAt();
        this.createdAt = data.createdAt();
        this.updatedAt = data.updatedAt();
    }

    public static MentorProfile create(Long userId, Gender gender, Long hometownCityId, Long currentDistrictId,
                                       String headline, String introduction, String teachingStyle,
                                       Integer experienceYears, String currentPosition, String workplace,
                                       String education, String major, MeetingType meetingType) {
        LocalDateTime now = LocalDateTime.now();
        MentorProfile mentorProfile = new MentorProfile(new MentorProfileRestoreData(null, userId, "", null, gender,
                hometownCityId, currentDistrictId, headline, introduction, teachingStyle, experienceYears,
                currentPosition, workplace, education, major, meetingType, MentorApprovalStatus.DRAFT, null, null,
                null, now, now));
        mentorProfile.validateExperienceYears(experienceYears);
        return mentorProfile;
    }

    public static MentorProfile create(Long userId, String ignoredAvatarUrl, Gender gender, Long hometownCityId,
                                       Long currentDistrictId, String headline, String introduction,
                                       String teachingStyle, Integer experienceYears, String currentPosition,
                                       String workplace, String education, String major, MeetingType meetingType) {
        return create(userId, gender, hometownCityId, currentDistrictId, headline, introduction, teachingStyle,
                experienceYears, currentPosition, workplace, education, major, meetingType);
    }

    public static MentorProfile restore(MentorProfileRestoreData data) {
        return new MentorProfile(data);
    }

    public void updateProfile(Gender gender, Long hometownCityId, Long currentDistrictId, String headline,
                              String introduction, String teachingStyle, Integer experienceYears,
                              String currentPosition, String workplace, String education, String major,
                              MeetingType meetingType) {
        validateExperienceYears(experienceYears);
        this.gender = gender;
        this.hometownCityId = hometownCityId;
        this.currentDistrictId = currentDistrictId;
        this.headline = headline;
        this.introduction = introduction;
        this.teachingStyle = teachingStyle;
        this.experienceYears = experienceYears;
        this.currentPosition = currentPosition;
        this.workplace = workplace;
        this.education = education;
        this.major = major;
        this.meetingType = meetingType;
    }

    public void updateProfile(String ignoredAvatarUrl, Gender gender, Long hometownCityId, Long currentDistrictId,
                              String headline, String introduction, String teachingStyle,
                              Integer experienceYears, String currentPosition, String workplace,
                              String education, String major, MeetingType meetingType) {
        updateProfile(gender, hometownCityId, currentDistrictId, headline, introduction, teachingStyle,
                experienceYears, currentPosition, workplace, education, major, meetingType);
    }

    public void updateAvatar(Long avatarMediaId, String avatarUrl) {
        if (avatarMediaId == null) {
            throw new InvalidDataException("Avatar media id is required");
        }
        if (avatarUrl == null || avatarUrl.isBlank()) {
            throw new InvalidDataException("Avatar url is required");
        }
        this.avatarMediaId = avatarMediaId;
        this.avatarUrl = avatarUrl;
    }

    public void submitForReview() {
        if (approvalStatus == MentorApprovalStatus.APPROVED) {
            throw new InvalidDataException("Approved mentor profile cannot be submitted");
        }
        if (approvalStatus == MentorApprovalStatus.SUSPENDED) {
            throw new InvalidDataException("Suspended mentor profile cannot be submitted");
        }
        this.approvalStatus = MentorApprovalStatus.PENDING;
        this.approvalNote = null;
        this.approvedBy = null;
        this.approvedAt = null;
    }

    public void approve(Long adminUserId, String approvalNote) {
        validatePendingForReview();
        if (adminUserId == null) {
            throw new InvalidDataException("Admin user id is required when approving mentor");
        }
        this.approvalStatus = MentorApprovalStatus.APPROVED;
        this.approvalNote = normalizeApprovalNote(approvalNote);
        this.approvedBy = adminUserId;
        this.approvedAt = LocalDateTime.now();
    }

    public void reject(String approvalNote) {
        validatePendingForReview();
        if (approvalNote == null || approvalNote.isBlank()) {
            throw new InvalidDataException("Approval note is required when rejecting mentor");
        }
        this.approvalStatus = MentorApprovalStatus.REJECTED;
        this.approvalNote = approvalNote.trim();
        this.approvedBy = null;
        this.approvedAt = null;
    }

    private void validateExperienceYears(Integer experienceYears) {
        if (experienceYears != null && experienceYears < 0) {
            throw new InvalidDataException("Experience years must be greater than or equal to 0");
        }
    }

    private void validatePendingForReview() {
        if (approvalStatus != MentorApprovalStatus.PENDING) {
            throw new InvalidDataException("Only pending mentor profile can be reviewed");
        }
    }

    private String normalizeApprovalNote(String approvalNote) {
        if (approvalNote == null || approvalNote.isBlank()) {
            return null;
        }
        return approvalNote.trim();
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public Long getAvatarMediaId() {
        return avatarMediaId;
    }

    public Gender getGender() {
        return gender;
    }

    public Long getHometownCityId() {
        return hometownCityId;
    }

    public Long getCurrentDistrictId() {
        return currentDistrictId;
    }

    public String getHeadline() {
        return headline;
    }

    public String getIntroduction() {
        return introduction;
    }

    public String getTeachingStyle() {
        return teachingStyle;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public String getCurrentPosition() {
        return currentPosition;
    }

    public String getWorkplace() {
        return workplace;
    }

    public String getEducation() {
        return education;
    }

    public String getMajor() {
        return major;
    }

    public MeetingType getMeetingType() {
        return meetingType;
    }

    public MentorApprovalStatus getApprovalStatus() {
        return approvalStatus;
    }

    public String getApprovalNote() {
        return approvalNote;
    }

    public Long getApprovedBy() {
        return approvedBy;
    }

    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
