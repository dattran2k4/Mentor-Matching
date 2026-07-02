package com.mentormatching.modules.mentor.application.dto;

public record MentorMediaAssetSummary(Long id, String deliveryUrl, String resourceType, String accessType,
                                      String purpose, String status, Long uploadedByUserId) {
}
