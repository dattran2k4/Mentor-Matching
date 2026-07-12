-- Seed completed and confirmed bookings for review testing.
SET NAMES utf8mb4;

INSERT INTO bookings (
    student_user_id, student_name,
    mentor_id, mentor_name,
    mentor_subject_id, subject_name, grade_name,
    booking_date, start_time, end_time,
    price_per_hour, total_amount,
    meeting_type, meeting_link,
    status, note,
    created_at, updated_at
)
VALUES
    -- Booking 1: Completed, Learner 1 with Mentor 1 (Toán Lớp 9)
    (
        (SELECT id FROM users WHERE email = 'learner01@mentor-matching.local'),
        'Learner Kim Ngan',
        (SELECT id FROM mentor_profiles WHERE user_id = (SELECT id FROM users WHERE email = 'mentor01@mentor-matching.local')),
        'Mentor Minh Anh',
        (SELECT ms.id FROM mentor_subjects ms JOIN mentor_profiles mp ON ms.mentor_id = mp.id JOIN users u ON mp.user_id = u.id JOIN subject_grades sg ON ms.subject_grade_id = sg.id JOIN subjects s ON sg.subject_id = s.id JOIN grades g ON sg.grade_id = g.id WHERE u.email = 'mentor01@mentor-matching.local' AND s.name = 'Toán' AND g.name = 'Lớp 9' LIMIT 1),
        'Toán', 'Lớp 9',
        '2026-06-05', '08:00:00', '10:00:00',
        220000.00, 440000.00,
        'ONLINE', 'https://meet.google.com/abc-defg-hij',
        'COMPLETED', 'Buổi học đầu tiên về chuyên đề đại số',
        '2026-06-04 18:00:00', '2026-06-05 10:00:00'
    ),
    -- Booking 2: Completed, Learner 2 with Mentor 1 (Toán Lớp 9)
    (
        (SELECT id FROM users WHERE email = 'learner02@mentor-matching.local'),
        'Learner An Nhi',
        (SELECT id FROM mentor_profiles WHERE user_id = (SELECT id FROM users WHERE email = 'mentor01@mentor-matching.local')),
        'Mentor Minh Anh',
        (SELECT ms.id FROM mentor_subjects ms JOIN mentor_profiles mp ON ms.mentor_id = mp.id JOIN users u ON mp.user_id = u.id JOIN subject_grades sg ON ms.subject_grade_id = sg.id JOIN subjects s ON sg.subject_id = s.id JOIN grades g ON sg.grade_id = g.id WHERE u.email = 'mentor01@mentor-matching.local' AND s.name = 'Toán' AND g.name = 'Lớp 9' LIMIT 1),
        'Toán', 'Lớp 9',
        '2026-06-06', '14:00:00', '16:00:00',
        220000.00, 440000.00,
        'ONLINE', 'https://meet.google.com/abc-defg-hij',
        'COMPLETED', 'Buổi học thứ hai về hình học',
        '2026-06-05 18:00:00', '2026-06-06 16:00:00'
    ),
    -- Booking 3: Completed, Learner 3 with Mentor 1 (Toán Lớp 9)
    (
        (SELECT id FROM users WHERE email = 'learner03@mentor-matching.local'),
        'Learner Hoang Long',
        (SELECT id FROM mentor_profiles WHERE user_id = (SELECT id FROM users WHERE email = 'mentor01@mentor-matching.local')),
        'Mentor Minh Anh',
        (SELECT ms.id FROM mentor_subjects ms JOIN mentor_profiles mp ON ms.mentor_id = mp.id JOIN users u ON mp.user_id = u.id JOIN subject_grades sg ON ms.subject_grade_id = sg.id JOIN subjects s ON sg.subject_id = s.id JOIN grades g ON sg.grade_id = g.id WHERE u.email = 'mentor01@mentor-matching.local' AND s.name = 'Toán' AND g.name = 'Lớp 9' LIMIT 1),
        'Toán', 'Lớp 9',
        '2026-06-07', '18:00:00', '20:00:00',
        220000.00, 440000.00,
        'ONLINE', 'https://meet.google.com/abc-defg-hij',
        'COMPLETED', 'Buổi học thứ ba về ôn thi',
        '2026-06-06 18:00:00', '2026-06-07 20:00:00'
    ),
    -- Booking 4: Confirmed (Not Completed yet), Learner 1 with Mentor 1 (Toán Lớp 9)
    (
        (SELECT id FROM users WHERE email = 'learner01@mentor-matching.local'),
        'Learner Kim Ngan',
        (SELECT id FROM mentor_profiles WHERE user_id = (SELECT id FROM users WHERE email = 'mentor01@mentor-matching.local')),
        'Mentor Minh Anh',
        (SELECT ms.id FROM mentor_subjects ms JOIN mentor_profiles mp ON ms.mentor_id = mp.id JOIN users u ON mp.user_id = u.id JOIN subject_grades sg ON ms.subject_grade_id = sg.id JOIN subjects s ON sg.subject_id = s.id JOIN grades g ON sg.grade_id = g.id WHERE u.email = 'mentor01@mentor-matching.local' AND s.name = 'Toán' AND g.name = 'Lớp 9' LIMIT 1),
        'Toán', 'Lớp 9',
        '2026-06-25', '08:00:00', '10:00:00',
        220000.00, 440000.00,
        'ONLINE', 'https://meet.google.com/abc-defg-hij',
        'CONFIRMED', 'Buổi học tương lai chưa hoàn thành',
        '2026-06-08 10:00:00', '2026-06-08 10:00:00'
    ),
    -- Booking 5: Completed, Learner 4 with Mentor 2 (Vật lý Lớp 10)
    (
        (SELECT id FROM users WHERE email = 'learner04@mentor-matching.local'),
        'Learner My Linh',
        (SELECT id FROM mentor_profiles WHERE user_id = (SELECT id FROM users WHERE email = 'mentor02@mentor-matching.local')),
        'Mentor Quoc Huy',
        (SELECT ms.id FROM mentor_subjects ms JOIN mentor_profiles mp ON ms.mentor_id = mp.id JOIN users u ON mp.user_id = u.id JOIN subject_grades sg ON ms.subject_grade_id = sg.id JOIN subjects s ON sg.subject_id = s.id JOIN grades g ON sg.grade_id = g.id WHERE u.email = 'mentor02@mentor-matching.local' AND s.name = 'Vật lý' AND g.name = 'Lớp 10' LIMIT 1),
        'Vật lý', 'Lớp 10',
        '2026-06-08', '14:00:00', '16:00:00',
        250000.00, 500000.00,
        'ONLINE', 'https://meet.google.com/xyz-pdqr-lmn',
        'COMPLETED', 'Bài Vật lý chuyển động thẳng đều',
        '2026-06-07 10:00:00', '2026-06-08 16:00:00'
    );
