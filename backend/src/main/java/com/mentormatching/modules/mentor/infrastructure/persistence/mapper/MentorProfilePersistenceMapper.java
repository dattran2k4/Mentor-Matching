package com.mentormatching.modules.mentor.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;

import com.mentormatching.modules.mentor.domain.MentorProfile;
import com.mentormatching.modules.mentor.domain.MentorProfileRestoreData;
import com.mentormatching.modules.mentor.infrastructure.persistence.entity.MentorProfileJpaEntity;

@Component
public class MentorProfilePersistenceMapper {

    public MentorProfile toDomain(MentorProfileJpaEntity entity) {
        return MentorProfile.restore(new MentorProfileRestoreData(entity.getId(), entity.getUserId(),
                entity.getAvatarUrl(), entity.getAvatarMediaId(), entity.getGender(), entity.getHometownCityId(),
                entity.getCurrentDistrictId(), entity.getHeadline(), entity.getIntroduction(),
                entity.getTeachingStyle(), entity.getExperienceYears(), entity.getCurrentPosition(),
                entity.getWorkplace(), entity.getEducation(), entity.getMajor(), entity.getMeetingType(),
                entity.getApprovalStatus(), entity.getApprovalNote(), entity.getApprovedBy(),
                entity.getApprovedAt(), entity.getCreatedAt(), entity.getUpdatedAt()));
    }

    public MentorProfileJpaEntity toEntity(MentorProfile mentorProfile) {
        return MentorProfileJpaEntity.builder()
                .id(mentorProfile.getId())
                .userId(mentorProfile.getUserId())
                .avatarUrl(mentorProfile.getAvatarUrl())
                .avatarMediaId(mentorProfile.getAvatarMediaId())
                .gender(mentorProfile.getGender())
                .hometownCityId(mentorProfile.getHometownCityId())
                .currentDistrictId(mentorProfile.getCurrentDistrictId())
                .headline(mentorProfile.getHeadline())
                .introduction(mentorProfile.getIntroduction())
                .teachingStyle(mentorProfile.getTeachingStyle())
                .experienceYears(mentorProfile.getExperienceYears())
                .currentPosition(mentorProfile.getCurrentPosition())
                .workplace(mentorProfile.getWorkplace())
                .education(mentorProfile.getEducation())
                .major(mentorProfile.getMajor())
                .meetingType(mentorProfile.getMeetingType())
                .approvalStatus(mentorProfile.getApprovalStatus())
                .approvalNote(mentorProfile.getApprovalNote())
                .approvedBy(mentorProfile.getApprovedBy())
                .approvedAt(mentorProfile.getApprovedAt())
                .createdAt(mentorProfile.getCreatedAt())
                .updatedAt(mentorProfile.getUpdatedAt())
                .build();
    }
}
