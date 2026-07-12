package com.mentormatching.modules.mentor.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;

import com.mentormatching.modules.mentor.domain.MentorVerification;
import com.mentormatching.modules.mentor.domain.MentorVerificationRestoreData;
import com.mentormatching.modules.mentor.infrastructure.persistence.entity.MentorVerificationJpaEntity;

@Component
public class MentorVerificationPersistenceMapper {

    public MentorVerification toDomain(MentorVerificationJpaEntity entity) {
        return MentorVerification.restore(new MentorVerificationRestoreData(entity.getId(), entity.getMentorId(),
                entity.getFullName(), entity.getIdCardNumber(), entity.getIdCardFrontUrl(),
                entity.getIdCardFrontMediaId(), entity.getIdCardBackUrl(), entity.getIdCardBackMediaId(),
                entity.getSelfieWithIdUrl(), entity.getSelfieWithIdMediaId(), entity.getVerificationStatus(),
                entity.getVerifiedBy(), entity.getVerifiedAt(), entity.getRejectionReason(),
                entity.getCreatedAt(), entity.getUpdatedAt()));
    }

    public MentorVerificationJpaEntity toEntity(MentorVerification mentorVerification) {
        return MentorVerificationJpaEntity.builder()
                .id(mentorVerification.getId())
                .mentorId(mentorVerification.getMentorId())
                .fullName(mentorVerification.getFullName())
                .idCardNumber(mentorVerification.getIdCardNumber())
                .idCardFrontUrl(mentorVerification.getIdCardFrontUrl())
                .idCardFrontMediaId(mentorVerification.getIdCardFrontMediaId())
                .idCardBackUrl(mentorVerification.getIdCardBackUrl())
                .idCardBackMediaId(mentorVerification.getIdCardBackMediaId())
                .selfieWithIdUrl(mentorVerification.getSelfieWithIdUrl())
                .selfieWithIdMediaId(mentorVerification.getSelfieWithIdMediaId())
                .verificationStatus(mentorVerification.getVerificationStatus())
                .verifiedBy(mentorVerification.getVerifiedBy())
                .verifiedAt(mentorVerification.getVerifiedAt())
                .rejectionReason(mentorVerification.getRejectionReason())
                .createdAt(mentorVerification.getCreatedAt())
                .updatedAt(mentorVerification.getUpdatedAt())
                .build();
    }
}
