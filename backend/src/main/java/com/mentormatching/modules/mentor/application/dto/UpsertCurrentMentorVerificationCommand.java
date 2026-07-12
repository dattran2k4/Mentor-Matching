package com.mentormatching.modules.mentor.application.dto;

public record UpsertCurrentMentorVerificationCommand(Long userId, String fullName, String idCardNumber,
                                                     Long idCardFrontMediaId, Long idCardBackMediaId,
                                                     Long selfieWithIdMediaId, String idCardFrontUrl,
                                                     String idCardBackUrl, String selfieWithIdUrl) {

    public UpsertCurrentMentorVerificationCommand(Long userId, String fullName, String idCardNumber,
                                                  String idCardFrontUrl, String idCardBackUrl,
                                                  String selfieWithIdUrl) {
        this(userId, fullName, idCardNumber, null, null, null, idCardFrontUrl, idCardBackUrl, selfieWithIdUrl);
    }
}
