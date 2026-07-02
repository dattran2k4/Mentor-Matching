package com.mentormatching.modules.media.infrastructure.persistence.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.mentormatching.modules.media.domain.MediaAccessType;
import com.mentormatching.modules.media.domain.MediaProvider;
import com.mentormatching.modules.media.domain.MediaPurpose;
import com.mentormatching.modules.media.domain.MediaResourceType;
import com.mentormatching.modules.media.domain.MediaStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
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
@Table(name = "media_assets", uniqueConstraints = {
        @UniqueConstraint(name = "uk_media_assets_provider_object_key", columnNames = {"provider", "object_key"})
})
public class MediaAssetJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "provider", nullable = false, length = 30)
    private MediaProvider provider;

    @Column(name = "bucket_name")
    private String bucketName;

    @Column(name = "object_key", nullable = false, length = 500)
    private String objectKey;

    @Column(name = "provider_asset_id")
    private String providerAssetId;

    @Column(name = "delivery_url", columnDefinition = "TEXT")
    private String deliveryUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "resource_type", nullable = false, length = 30)
    private MediaResourceType resourceType;

    @Column(name = "mime_type", length = 100)
    private String mimeType;

    @Column(name = "original_filename")
    private String originalFilename;

    @Column(name = "file_size_bytes")
    private Long fileSizeBytes;

    @Column(name = "width")
    private Integer width;

    @Column(name = "height")
    private Integer height;

    @Enumerated(EnumType.STRING)
    @Column(name = "access_type", nullable = false, length = 30)
    private MediaAccessType accessType;

    @Enumerated(EnumType.STRING)
    @Column(name = "purpose", nullable = false, length = 50)
    private MediaPurpose purpose;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private MediaStatus status = MediaStatus.PENDING;

    @Column(name = "uploaded_by_user_id")
    private Long uploadedByUserId;

    @Column(name = "version", length = 100)
    private String version;

    @Column(name = "etag")
    private String etag;

    @Column(name = "metadata_json", columnDefinition = "TEXT")
    private String metadataJson;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
