package com.mentormatching.modules.mentor.presentation.dto.response;

import java.time.LocalDateTime;

import com.mentormatching.modules.mentor.application.dto.CurrentMentorVerificationDetails;

public record CurrentMentorVerificationResponse(Long id, Long mentorId, String fullName, String idCardNumber,
                                                String idCardFrontUrl, Long idCardFrontMediaId,
                                                String idCardBackUrl, Long idCardBackMediaId,
                                                String selfieWithIdUrl, Long selfieWithIdMediaId,
                                                String verificationStatus, Long verifiedBy, LocalDateTime verifiedAt,
                                                String rejectionReason, LocalDateTime createdAt,
                                                LocalDateTime updatedAt) {

    public static CurrentMentorVerificationResponse from(CurrentMentorVerificationDetails verification) {
        return new CurrentMentorVerificationResponse(verification.id(), verification.mentorId(),
                verification.fullName(), verification.idCardNumber(), verification.idCardFrontUrl(),
                verification.idCardFrontMediaId(), verification.idCardBackUrl(), verification.idCardBackMediaId(),
                verification.selfieWithIdUrl(), verification.selfieWithIdMediaId(),
                verification.verificationStatus(), verification.verifiedBy(), verification.verifiedAt(),
                verification.rejectionReason(), verification.createdAt(), verification.updatedAt());
    }
}
