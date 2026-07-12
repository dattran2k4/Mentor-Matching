-- Add BOOKING_COMPLETED to notifications type check constraint.
ALTER TABLE notifications
    DROP CONSTRAINT chk_notifications_type;

ALTER TABLE notifications
    ADD CONSTRAINT chk_notifications_type
        CHECK (type IS NULL OR type IN (
            'BOOKING_CREATED',
            'BOOKING_CONFIRMED',
            'BOOKING_CANCELLED',
            'BOOKING_REJECTED',
            'BOOKING_COMPLETED',
            'BOOKING_REMINDER',
            'PAYMENT_PENDING',
            'PAYMENT_SUCCESS',
            'PAYMENT_FAILED',
            'PAYMENT_REFUNDED',
            'MENTOR_APPROVED',
            'MENTOR_REJECTED',
            'SYSTEM'
        ));
