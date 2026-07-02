package com.mentormatching.modules.mentor.infrastructure.persistence.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.mentormatching.modules.mentor.domain.Gender;
import com.mentormatching.modules.mentor.domain.MeetingType;
import com.mentormatching.modules.mentor.domain.MentorApprovalStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "mentor_profiles")
public class MentorProfileJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "avatar_url", nullable = false, columnDefinition = "TEXT")
    private String avatarUrl;

    @Column(name = "avatar_media_id")
    private Long avatarMediaId;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @Column(name = "hometown_city_id")
    private Long hometownCityId;

    @Column(name = "current_district_id")
    private Long currentDistrictId;

    @Column(name = "headline")
    private String headline;

    @Column(name = "introduction", columnDefinition = "TEXT")
    private String introduction;

    @Column(name = "teaching_style", columnDefinition = "TEXT")
    private String teachingStyle;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "current_position")
    private String currentPosition;

    @Column(name = "workplace")
    private String workplace;

    @Column(name = "education")
    private String education;

    @Column(name = "major")
    private String major;

    @Enumerated(EnumType.STRING)
    @Column(name = "meeting_type")
    private MeetingType meetingType;

    @Enumerated(EnumType.STRING)
    @Column(name = "approval_status")
    private MentorApprovalStatus approvalStatus;

    @Column(name = "approval_note", columnDefinition = "TEXT")
    private String approvalNote;

    @Column(name = "approved_by")
    private Long approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
