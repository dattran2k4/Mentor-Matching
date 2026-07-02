package com.mentormatching;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.List;
import java.util.Map;

@SpringBootTest
public class FindMentorSubjectsTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    public void printMentorSubjects() {
        System.out.println("=========================================");
        List<Map<String, Object>> mentors = jdbcTemplate.queryForList("SELECT mp.id as mentor_profile_id, u.email as mentor_email FROM mentor_profiles mp JOIN users u ON mp.user_id = u.id");
        for (Map<String, Object> mentor : mentors) {
            System.out.println("Mentor: " + mentor.get("mentor_email") + " (Profile ID: " + mentor.get("mentor_profile_id") + ")");
            List<Map<String, Object>> subjects = jdbcTemplate.queryForList("SELECT ms.id as mentor_subject_id, s.name as subject_name FROM mentor_subjects ms JOIN subject_grades sg ON ms.subject_grade_id = sg.id JOIN subjects s ON sg.subject_id = s.id WHERE ms.mentor_id = ?", mentor.get("mentor_profile_id"));
            for (Map<String, Object> subject : subjects) {
                System.out.println("  - Subject: " + subject.get("subject_name") + " (MentorSubject ID: " + subject.get("mentor_subject_id") + ")");
            }
        }
        System.out.println("=========================================");
    }
}
