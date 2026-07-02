package com.mentormatching.modules.mentor.application.port.out;

import java.util.List;
import java.util.Optional;

import com.mentormatching.modules.mentor.application.dto.AdminMentorVerificationDetail;
import com.mentormatching.modules.mentor.application.dto.AdminMentorVerificationListItem;
import com.mentormatching.modules.mentor.application.dto.AdminMentorDetail;
import com.mentormatching.modules.mentor.application.dto.AdminMentorListItem;
import com.mentormatching.modules.mentor.application.dto.CurrentMentorDetails;
import com.mentormatching.modules.mentor.application.dto.GetAdminMentorsQuery;
import com.mentormatching.modules.mentor.application.dto.GetAdminMentorVerificationsQuery;
import com.mentormatching.modules.mentor.application.dto.GetMentorsQuery;
import com.mentormatching.modules.mentor.application.dto.MentorAchievementDetail;
import com.mentormatching.modules.mentor.application.dto.MentorAvailabilityDetail;
import com.mentormatching.modules.mentor.application.dto.MentorDetail;
import com.mentormatching.modules.mentor.application.dto.MentorListItem;
import com.mentormatching.modules.mentor.application.dto.MentorOptionDetail;
import com.mentormatching.modules.mentor.application.dto.MentorSubjectDetail;
import com.mentormatching.modules.mentor.application.dto.MentorTraitsDetail;
import com.mentormatching.shared.response.PageResponse;

public interface MentorReadRepositoryPort {

    PageResponse<AdminMentorListItem> findAdminMentors(GetAdminMentorsQuery query, List<Long> subjectGradeIds);

    Optional<AdminMentorDetail> findAdminMentorDetailById(Long mentorId);

    PageResponse<AdminMentorVerificationListItem> findAdminMentorVerifications(GetAdminMentorVerificationsQuery query);

    Optional<AdminMentorVerificationDetail> findAdminMentorVerificationDetailById(Long verificationId);

    PageResponse<MentorListItem> findApprovedMentors(GetMentorsQuery query, List<Long> subjectGradeIds);

    Optional<CurrentMentorDetails> findCurrentMentorByMentorId(Long mentorId);

    Optional<MentorDetail> findApprovedMentorDetailById(Long mentorId);

    boolean existsApprovedMentorById(Long mentorId);

    List<MentorSubjectDetail> findMentorSubjects(Long mentorId);

    List<MentorSubjectDetail> findAllMentorSubjects(Long mentorId);

    List<MentorOptionDetail> findPersonalityOptions();

    List<MentorOptionDetail> findHighlightOptions();

    MentorTraitsDetail findMentorTraits(Long mentorId);

    List<MentorAchievementDetail> findMentorAchievements(Long mentorId);

    List<MentorAvailabilityDetail> findMentorAvailabilities(Long mentorId);
}
