CREATE TABLE media_assets (
    id BIGINT NOT NULL AUTO_INCREMENT,
    provider VARCHAR(30) NOT NULL,
    bucket_name VARCHAR(255),
    object_key VARCHAR(500) NOT NULL,
    provider_asset_id VARCHAR(255),
    delivery_url TEXT,
    resource_type VARCHAR(30) NOT NULL,
    mime_type VARCHAR(100),
    original_filename VARCHAR(255),
    file_size_bytes BIGINT,
    width INT,
    height INT,
    access_type VARCHAR(30) NOT NULL,
    purpose VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL,
    uploaded_by_user_id BIGINT,
    version VARCHAR(100),
    etag VARCHAR(255),
    metadata_json TEXT,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),

    CONSTRAINT pk_media_assets PRIMARY KEY (id),
    CONSTRAINT uk_media_assets_provider_object_key UNIQUE (provider, object_key),
    CONSTRAINT fk_media_assets_uploaded_by_user_id FOREIGN KEY (uploaded_by_user_id) REFERENCES users (id) ON DELETE SET NULL ON UPDATE RESTRICT,
    CONSTRAINT chk_media_assets_provider CHECK (provider IN ('CLOUDINARY', 'S3', 'FIREBASE')),
    CONSTRAINT chk_media_assets_resource_type CHECK (resource_type IN ('IMAGE', 'VIDEO', 'RAW')),
    CONSTRAINT chk_media_assets_access_type CHECK (access_type IN ('PUBLIC', 'PRIVATE')),
    CONSTRAINT chk_media_assets_purpose CHECK (purpose IN ('AVATAR', 'VERIFICATION', 'ACHIEVEMENT', 'REVIEW_ATTACHMENT')),
    CONSTRAINT chk_media_assets_status CHECK (status IN ('PENDING', 'READY', 'DELETED')),
    CONSTRAINT chk_media_assets_file_size_bytes CHECK (file_size_bytes IS NULL OR file_size_bytes >= 0),
    CONSTRAINT chk_media_assets_width CHECK (width IS NULL OR width >= 0),
    CONSTRAINT chk_media_assets_height CHECK (height IS NULL OR height >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_media_assets_uploaded_by_user_id ON media_assets (uploaded_by_user_id);
CREATE INDEX idx_media_assets_purpose_status ON media_assets (purpose, status);
CREATE INDEX idx_media_assets_provider_asset_id ON media_assets (provider_asset_id);
