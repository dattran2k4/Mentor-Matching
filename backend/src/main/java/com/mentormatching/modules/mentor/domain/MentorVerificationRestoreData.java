package com.mentormatching.modules.mentor.domain;

import java.time.LocalDateTime;

public record MentorVerificationRestoreData(Long id, Long mentorId, String fullName, String idCardNumber,
                                            String idCardFrontUrl, Long idCardFrontMediaId,
                                            String idCardBackUrl, Long idCardBackMediaId,
                                            String selfieWithIdUrl, Long selfieWithIdMediaId,
                                            MentorVerificationStatus verificationStatus, Long verifiedBy,
                                            LocalDateTime verifiedAt, String rejectionReason,
                                            LocalDateTime createdAt, LocalDateTime updatedAt) {

    public MentorVerificationRestoreData(Long id, Long mentorId, String fullName, String idCardNumber,
                                         String idCardFrontUrl, String idCardBackUrl, String selfieWithIdUrl,
                                         MentorVerificationStatus verificationStatus, Long verifiedBy,
                                         LocalDateTime verifiedAt, String rejectionReason,
                                         LocalDateTime createdAt, LocalDateTime updatedAt) {
        this(id, mentorId, fullName, idCardNumber, idCardFrontUrl, null, idCardBackUrl, null, selfieWithIdUrl,
                null, verificationStatus, verifiedBy, verifiedAt, rejectionReason, createdAt, updatedAt);
    }
}
