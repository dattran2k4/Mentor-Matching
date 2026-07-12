ALTER TABLE mentor_profiles DROP CHECK chk_mentor_profiles_approval_status;

ALTER TABLE mentor_profiles
    ADD CONSTRAINT chk_mentor_profiles_approval_status
        CHECK (approval_status IS NULL OR approval_status IN ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'));
