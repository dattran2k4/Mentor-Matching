package com.mentormatching.modules.mentor.application.dto;

import java.time.LocalDateTime;

public record CurrentMentorVerificationDetails(Long id, Long mentorId, String fullName, String idCardNumber,
                                               String idCardFrontUrl, Long idCardFrontMediaId,
                                               String idCardBackUrl, Long idCardBackMediaId,
                                               String selfieWithIdUrl, Long selfieWithIdMediaId,
                                               String verificationStatus, Long verifiedBy, LocalDateTime verifiedAt,
                                               String rejectionReason, LocalDateTime createdAt,
                                               LocalDateTime updatedAt) {

    public CurrentMentorVerificationDetails(Long id, Long mentorId, String fullName, String idCardNumber,
                                            String idCardFrontUrl, String idCardBackUrl, String selfieWithIdUrl,
                                            String verificationStatus, Long verifiedBy, LocalDateTime verifiedAt,
                                            String rejectionReason, LocalDateTime createdAt,
                                            LocalDateTime updatedAt) {
        this(id, mentorId, fullName, idCardNumber, idCardFrontUrl, null, idCardBackUrl, null, selfieWithIdUrl,
                null, verificationStatus, verifiedBy, verifiedAt, rejectionReason, createdAt, updatedAt);
    }
}
