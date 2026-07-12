ALTER TABLE mentor_verifications
    ADD COLUMN id_card_front_media_id BIGINT NULL AFTER id_card_front_url,
    ADD COLUMN id_card_back_media_id BIGINT NULL AFTER id_card_back_url,
    ADD COLUMN selfie_with_id_media_id BIGINT NULL AFTER selfie_with_id_url,
    ADD CONSTRAINT fk_mentor_verifications_id_card_front_media_id
        FOREIGN KEY (id_card_front_media_id) REFERENCES media_assets (id)
        ON DELETE SET NULL ON UPDATE RESTRICT,
    ADD CONSTRAINT fk_mentor_verifications_id_card_back_media_id
        FOREIGN KEY (id_card_back_media_id) REFERENCES media_assets (id)
        ON DELETE SET NULL ON UPDATE RESTRICT,
    ADD CONSTRAINT fk_mentor_verifications_selfie_with_id_media_id
        FOREIGN KEY (selfie_with_id_media_id) REFERENCES media_assets (id)
        ON DELETE SET NULL ON UPDATE RESTRICT;

CREATE INDEX idx_mentor_verifications_id_card_front_media_id
    ON mentor_verifications (id_card_front_media_id);

CREATE INDEX idx_mentor_verifications_id_card_back_media_id
    ON mentor_verifications (id_card_back_media_id);

CREATE INDEX idx_mentor_verifications_selfie_with_id_media_id
    ON mentor_verifications (selfie_with_id_media_id);
