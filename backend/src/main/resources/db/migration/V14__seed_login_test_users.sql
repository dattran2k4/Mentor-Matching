-- Ensure local/test login accounts have a known password.
-- Plain password for every account below: 123456

SET NAMES utf8mb4;

CREATE TEMPORARY TABLE tmp_login_test_users (
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL,
    user_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO tmp_login_test_users (full_name, email, password_hash, phone, role, user_type, status)
VALUES
    ('Learner Test', 'learner@test.com', '$2a$10$f8K0p/rAvE9SrsZcahthQuKA79pIAqGt9APO14f3.czxnCPp9q6Iu', '0900000001', 'LEARNER', 'STUDENT', 'ACTIVE'),
    ('Mentor Test', 'mentor@test.com', '$2a$10$f8K0p/rAvE9SrsZcahthQuKA79pIAqGt9APO14f3.czxnCPp9q6Iu', '0900000002', 'MENTOR', 'WORKING_ADULT', 'ACTIVE'),
    ('Manager Test', 'manager@test.com', '$2a$10$f8K0p/rAvE9SrsZcahthQuKA79pIAqGt9APO14f3.czxnCPp9q6Iu', '0900000003', 'MANAGER', 'WORKING_ADULT', 'ACTIVE'),
    ('Admin Test', 'admin@test.com', '$2a$10$f8K0p/rAvE9SrsZcahthQuKA79pIAqGt9APO14f3.czxnCPp9q6Iu', '0900000004', 'ADMIN', 'WORKING_ADULT', 'ACTIVE');

INSERT INTO users (full_name, email, password, phone, role, user_type, status)
SELECT full_name, email, password_hash, phone, role, user_type, status
FROM tmp_login_test_users
ON DUPLICATE KEY UPDATE
    password = VALUES(password),
    full_name = VALUES(full_name),
    phone = VALUES(phone),
    role = VALUES(role),
    user_type = VALUES(user_type),
    status = VALUES(status);

DROP TEMPORARY TABLE tmp_login_test_users;
