package com.mentormatching.modules.mentor.infrastructure.persistence.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.mentormatching.modules.mentor.domain.MentorVerificationStatus;

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
@Table(name = "mentor_verifications")
public class MentorVerificationJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "mentor_id", nullable = false, unique = true)
    private Long mentorId;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "id_card_number", length = 50)
    private String idCardNumber;

    @Column(name = "id_card_front_url", nullable = false, columnDefinition = "TEXT")
    private String idCardFrontUrl;

    @Column(name = "id_card_front_media_id")
    private Long idCardFrontMediaId;

    @Column(name = "id_card_back_url", nullable = false, columnDefinition = "TEXT")
    private String idCardBackUrl;

    @Column(name = "id_card_back_media_id")
    private Long idCardBackMediaId;

    @Column(name = "selfie_with_id_url", columnDefinition = "TEXT")
    private String selfieWithIdUrl;

    @Column(name = "selfie_with_id_media_id")
    private Long selfieWithIdMediaId;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", nullable = false, length = 50)
    private MentorVerificationStatus verificationStatus = MentorVerificationStatus.PENDING;

    @Column(name = "verified_by")
    private Long verifiedBy;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
