ALTER TABLE mentor_profiles
    ADD COLUMN avatar_media_id BIGINT NULL AFTER avatar_url,
    ADD CONSTRAINT fk_mentor_profiles_avatar_media_id
        FOREIGN KEY (avatar_media_id) REFERENCES media_assets (id)
        ON DELETE SET NULL ON UPDATE RESTRICT;

CREATE INDEX idx_mentor_profiles_avatar_media_id ON mentor_profiles (avatar_media_id);
