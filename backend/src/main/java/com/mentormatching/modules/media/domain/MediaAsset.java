package com.mentormatching.modules.media.domain;

import java.time.LocalDateTime;

import com.mentormatching.shared.exception.InvalidDataException;

public class MediaAsset {

    private final Long id;
    private final MediaProvider provider; // CLOUDINARY, S3, FIREBASE.
    private final String bucketName; // Tên bucket/container/cloud name; với Cloudinary có thể là cloud name hoặc null nếu đã nằm trong config.
    private final String objectKey; // Định danh chính của file trên provider: Cloudinary public_id, S3 object key, Firebase storage path.
    private String providerAssetId; // ID riêng do provider cấp; Cloudinary có asset_id, S3/Firebase có thể để null.
    private String deliveryUrl; // URL dùng để hiển thị/tải file; có thể là secure_url, CDN URL, hoặc signed URL tùy accessType.
    private MediaResourceType resourceType;
    private String mimeType; // image/jpeg, image/png, application/pdf.
    private String originalFilename; // Tên file gốc từ người dùng, chỉ dùng để hiển thị/audit, không dùng làm objectKey.
    private Long fileSizeBytes; // Dung lượng file theo byte sau khi upload/confirm.
    private Integer width; // Chiều rộng ảnh/video nếu provider trả về; null với file RAW hoặc khi chưa confirm.
    private Integer height; // Chiều cao ảnh/video nếu provider trả về; null với file RAW hoặc khi chưa confirm.
    private final MediaAccessType accessType;
    private final MediaPurpose purpose;
    private MediaStatus status;
    private final Long uploadedByUserId;
    private String version; // Version/generation từ provider: Cloudinary version, S3 versionId, Firebase generation.
    private String etag; // Checksum/ETag từ provider nếu có; hữu ích cho audit/cache/đối soát.
    private String metadataJson; // Metadata
    private final LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private MediaAsset(MediaAssetRestoreData data) {
        this.id = data.id();
        this.provider = requireNotNull(data.provider(), "Media provider is required");
        this.bucketName = blankToNull(data.bucketName());
        this.objectKey = requireNotBlank(data.objectKey(), "Media object key is required");
        this.providerAssetId = blankToNull(data.providerAssetId());
        this.deliveryUrl = blankToNull(data.deliveryUrl());
        this.resourceType = requireNotNull(data.resourceType(), "Media resource type is required");
        this.mimeType = blankToNull(data.mimeType());
        this.originalFilename = blankToNull(data.originalFilename());
        this.fileSizeBytes = validateNonNegative(data.fileSizeBytes(), "File size must not be negative");
        this.width = validateNonNegative(data.width(), "Width must not be negative");
        this.height = validateNonNegative(data.height(), "Height must not be negative");
        this.accessType = requireNotNull(data.accessType(), "Media access type is required");
        this.purpose = requireNotNull(data.purpose(), "Media purpose is required");
        this.status = requireNotNull(data.status(), "Media status is required");
        this.uploadedByUserId = data.uploadedByUserId();
        this.version = blankToNull(data.version());
        this.etag = blankToNull(data.etag());
        this.metadataJson = blankToNull(data.metadataJson());
        this.createdAt = data.createdAt() == null ? LocalDateTime.now() : data.createdAt();
        this.updatedAt = data.updatedAt() == null ? this.createdAt : data.updatedAt();
    }

    public static MediaAsset createPending(MediaProvider provider, String bucketName, String objectKey,
                                           MediaResourceType resourceType, MediaAccessType accessType,
                                           MediaPurpose purpose, Long uploadedByUserId,
                                           String originalFilename, String mimeType) {
        LocalDateTime now = LocalDateTime.now();
        return new MediaAsset(new MediaAssetRestoreData(null, provider, bucketName, objectKey, null, null,
                resourceType, mimeType, originalFilename, null, null, null, accessType, purpose,
                MediaStatus.PENDING, uploadedByUserId, null, null, null, now, now));
    }

    public static MediaAsset restore(MediaAssetRestoreData data) {
        return new MediaAsset(data);
    }

    public void markReady(String providerAssetId, String deliveryUrl, Long fileSizeBytes,
                          Integer width, Integer height, String version, String etag, String metadataJson) {
        if (status == MediaStatus.DELETED) {
            throw new InvalidDataException("Deleted media asset cannot be marked as ready");
        }
        this.providerAssetId = blankToNull(providerAssetId);
        this.deliveryUrl = blankToNull(deliveryUrl);
        this.fileSizeBytes = validateNonNegative(fileSizeBytes, "File size must not be negative");
        this.width = validateNonNegative(width, "Width must not be negative");
        this.height = validateNonNegative(height, "Height must not be negative");
        this.version = blankToNull(version);
        this.etag = blankToNull(etag);
        this.metadataJson = blankToNull(metadataJson);
        this.status = MediaStatus.READY;
        touch();
    }

    public void markDeleted() {
        if (status == MediaStatus.DELETED) {
            return;
        }
        this.status = MediaStatus.DELETED;
        touch();
    }

    public boolean isReady() {
        return status == MediaStatus.READY;
    }

    public boolean isOwnedBy(Long userId) {
        return uploadedByUserId != null && uploadedByUserId.equals(userId);
    }

    public Long getId() {
        return id;
    }

    public MediaProvider getProvider() {
        return provider;
    }

    public String getBucketName() {
        return bucketName;
    }

    public String getObjectKey() {
        return objectKey;
    }

    public String getProviderAssetId() {
        return providerAssetId;
    }

    public String getDeliveryUrl() {
        return deliveryUrl;
    }

    public MediaResourceType getResourceType() {
        return resourceType;
    }

    public String getMimeType() {
        return mimeType;
    }

    public String getOriginalFilename() {
        return originalFilename;
    }

    public Long getFileSizeBytes() {
        return fileSizeBytes;
    }

    public Integer getWidth() {
        return width;
    }

    public Integer getHeight() {
        return height;
    }

    public MediaAccessType getAccessType() {
        return accessType;
    }

    public MediaPurpose getPurpose() {
        return purpose;
    }

    public MediaStatus getStatus() {
        return status;
    }

    public Long getUploadedByUserId() {
        return uploadedByUserId;
    }

    public String getVersion() {
        return version;
    }

    public String getEtag() {
        return etag;
    }

    public String getMetadataJson() {
        return metadataJson;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    private void touch() {
        this.updatedAt = LocalDateTime.now();
    }

    private static <T> T requireNotNull(T value, String message) {
        if (value == null) {
            throw new InvalidDataException(message);
        }
        return value;
    }

    private static String requireNotBlank(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new InvalidDataException(message);
        }
        return value;
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value;
    }

    private static Long validateNonNegative(Long value, String message) {
        if (value != null && value < 0) {
            throw new InvalidDataException(message);
        }
        return value;
    }

    private static Integer validateNonNegative(Integer value, String message) {
        if (value != null && value < 0) {
            throw new InvalidDataException(message);
        }
        return value;
    }
}
