package com.mentormatching.modules.mentor.infrastructure.persistence;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

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
import com.mentormatching.modules.mentor.application.port.out.MentorReadRepositoryPort;
import com.mentormatching.modules.mentor.domain.MentorApprovalStatus;
import com.mentormatching.modules.mentor.infrastructure.persistence.entity.MentorAchievementJpaEntity;
import com.mentormatching.modules.mentor.infrastructure.persistence.repository.AdminMentorVerificationDetailProjection;
import com.mentormatching.modules.mentor.infrastructure.persistence.repository.AdminMentorVerificationListProjection;
import com.mentormatching.modules.mentor.infrastructure.persistence.repository.AdminMentorDetailProjection;
import com.mentormatching.modules.mentor.infrastructure.persistence.repository.AdminMentorListItemProjection;
import com.mentormatching.modules.mentor.infrastructure.persistence.repository.MentorAchievementJpaRepository;
import com.mentormatching.modules.mentor.infrastructure.persistence.repository.CurrentMentorDetailsProjection;
import com.mentormatching.modules.mentor.infrastructure.persistence.repository.MentorDetailProjection;
import com.mentormatching.modules.mentor.infrastructure.persistence.repository.MentorHighlightJpaRepository;
import com.mentormatching.modules.mentor.infrastructure.persistence.repository.MentorHighlightOptionJpaRepository;
import com.mentormatching.modules.mentor.infrastructure.persistence.repository.MentorListItemProjection;
import com.mentormatching.modules.mentor.infrastructure.persistence.repository.MentorOptionProjection;
import com.mentormatching.modules.mentor.infrastructure.persistence.repository.MentorPersonalityJpaRepository;
import com.mentormatching.modules.mentor.infrastructure.persistence.repository.MentorProfileJpaRepository;
import com.mentormatching.modules.mentor.infrastructure.persistence.repository.MentorSubjectDetailProjection;
import com.mentormatching.modules.mentor.infrastructure.persistence.repository.MentorSubjectJpaRepository;
import com.mentormatching.modules.mentor.infrastructure.persistence.repository.MentorVerificationJpaRepository;
import com.mentormatching.modules.scheduling.infrastructure.persistence.entity.MentorAvailabilityJpaEntity;
import com.mentormatching.modules.scheduling.infrastructure.persistence.repository.MentorAvailabilityJpaRepository;
import com.mentormatching.modules.mentor.infrastructure.persistence.repository.PersonalityOptionJpaRepository;
import com.mentormatching.shared.pagination.PageableUtils;
import com.mentormatching.shared.response.PageResponse;

@Component
public class MentorReadPersistenceAdapter implements MentorReadRepositoryPort {

    private static final Set<String> SORTABLE_FIELDS = Set.of("id", "fullName", "gender", "experienceYears",
            "meetingType", "createdAt", "minPrice");
    private static final Set<String> ADMIN_MENTOR_SORTABLE_FIELDS = Set.of("id", "fullName", "gender",
            "experienceYears", "meetingType", "createdAt", "approvalStatus", "minPrice");
    private static final Set<String> ADMIN_VERIFICATION_SORTABLE_FIELDS = Set.of("id", "createdAt", "updatedAt",
            "verificationStatus");

    private final MentorProfileJpaRepository mentorProfileJpaRepository;
    private final MentorSubjectJpaRepository mentorSubjectJpaRepository;
    private final MentorPersonalityJpaRepository mentorPersonalityJpaRepository;
    private final MentorHighlightJpaRepository mentorHighlightJpaRepository;
    private final PersonalityOptionJpaRepository personalityOptionJpaRepository;
    private final MentorHighlightOptionJpaRepository mentorHighlightOptionJpaRepository;
    private final MentorAchievementJpaRepository mentorAchievementJpaRepository;
    private final MentorAvailabilityJpaRepository mentorAvailabilityJpaRepository;
    private final MentorVerificationJpaRepository mentorVerificationJpaRepository;

    public MentorReadPersistenceAdapter(MentorProfileJpaRepository mentorProfileJpaRepository,
                                        MentorSubjectJpaRepository mentorSubjectJpaRepository,
                                        MentorPersonalityJpaRepository mentorPersonalityJpaRepository,
                                        MentorHighlightJpaRepository mentorHighlightJpaRepository,
                                        PersonalityOptionJpaRepository personalityOptionJpaRepository,
                                        MentorHighlightOptionJpaRepository mentorHighlightOptionJpaRepository,
                                        MentorAchievementJpaRepository mentorAchievementJpaRepository,
                                        MentorAvailabilityJpaRepository mentorAvailabilityJpaRepository,
                                        MentorVerificationJpaRepository mentorVerificationJpaRepository) {
        this.mentorProfileJpaRepository = mentorProfileJpaRepository;
        this.mentorSubjectJpaRepository = mentorSubjectJpaRepository;
        this.mentorPersonalityJpaRepository = mentorPersonalityJpaRepository;
        this.mentorHighlightJpaRepository = mentorHighlightJpaRepository;
        this.personalityOptionJpaRepository = personalityOptionJpaRepository;
        this.mentorHighlightOptionJpaRepository = mentorHighlightOptionJpaRepository;
        this.mentorAchievementJpaRepository = mentorAchievementJpaRepository;
        this.mentorAvailabilityJpaRepository = mentorAvailabilityJpaRepository;
        this.mentorVerificationJpaRepository = mentorVerificationJpaRepository;
    }

    @Override
    public PageResponse<AdminMentorListItem> findAdminMentors(GetAdminMentorsQuery query, List<Long> subjectGradeIds) {
        Pageable pageable = PageableUtils.buildPageable(query.page(), query.size(), query.sortBy(), query.sortDir(),
                ADMIN_MENTOR_SORTABLE_FIELDS);
        Page<AdminMentorListItemProjection> mentorPage = mentorProfileJpaRepository.findAdminMentors(
                query.approvalStatus(), containsPattern(query.search()), query.gender(), query.meetingType(),
                query.cityId(), query.districtId(), subjectGradeIds, pageable);
        return PageableUtils.toPageResponse(mentorPage, this::toAdminListItem);
    }

    @Override
    public Optional<AdminMentorDetail> findAdminMentorDetailById(Long mentorId) {
        return mentorProfileJpaRepository.findAdminMentorDetail(mentorId)
                .map(this::toAdminDetail);
    }

    @Override
    public PageResponse<AdminMentorVerificationListItem> findAdminMentorVerifications(
            GetAdminMentorVerificationsQuery query) {
        Pageable pageable = PageableUtils.buildPageable(query.page(), query.size(), query.sortBy(), query.sortDir(),
                ADMIN_VERIFICATION_SORTABLE_FIELDS);
        Page<AdminMentorVerificationListProjection> verificationPage = mentorVerificationJpaRepository
                .findAdminMentorVerifications(query.status(), pageable);
        return PageableUtils.toPageResponse(verificationPage, this::toAdminVerificationListItem);
    }

    @Override
    public Optional<AdminMentorVerificationDetail> findAdminMentorVerificationDetailById(Long verificationId) {
        return mentorVerificationJpaRepository.findAdminMentorVerificationDetailById(verificationId)
                .map(this::toAdminVerificationDetail);
    }

    @Override
    public PageResponse<MentorListItem> findApprovedMentors(GetMentorsQuery query, List<Long> subjectGradeIds) {
        Pageable pageable = PageableUtils.buildPageable(query.page(), query.size(), query.sortBy(), query.sortDir(),
                SORTABLE_FIELDS);
        Page<MentorListItemProjection> mentorPage = mentorProfileJpaRepository.findApprovedMentors(
                MentorApprovalStatus.APPROVED, containsPattern(query.search()), query.gender(), query.meetingType(),
                query.cityId(), query.districtId(), subjectGradeIds, pageable);
        return PageableUtils.toPageResponse(mentorPage, this::toListItem);
    }

    @Override
    public Optional<CurrentMentorDetails> findCurrentMentorByMentorId(Long mentorId) {
        return mentorProfileJpaRepository.findCurrentMentorDetailByMentorId(mentorId)
                .map(this::toCurrentMentorDetails);
    }

    @Override
    public Optional<MentorDetail> findApprovedMentorDetailById(Long mentorId) {
        return mentorProfileJpaRepository.findApprovedMentorDetail(mentorId, MentorApprovalStatus.APPROVED)
                .map(this::toDetail);
    }

    @Override
    public boolean existsApprovedMentorById(Long mentorId) {
        return mentorProfileJpaRepository.existsByIdAndApprovalStatus(mentorId, MentorApprovalStatus.APPROVED);
    }

    @Override
    public List<MentorSubjectDetail> findMentorSubjects(Long mentorId) {
        return mentorSubjectJpaRepository.findActiveDetailsByMentorId(mentorId).stream()
                .map(this::toSubjectDetail)
                .toList();
    }

    @Override
    public List<MentorSubjectDetail> findAllMentorSubjects(Long mentorId) {
        return mentorSubjectJpaRepository.findAllDetailsByMentorId(mentorId).stream()
                .map(this::toSubjectDetail)
                .toList();
    }

    @Override
    public List<MentorOptionDetail> findPersonalityOptions() {
        return personalityOptionJpaRepository.findAll().stream()
                .sorted(Comparator.comparing(option -> option.getName().toLowerCase()))
                .map(option -> new MentorOptionDetail(option.getId(), option.getName(), option.getDescription()))
                .toList();
    }

    @Override
    public List<MentorOptionDetail> findHighlightOptions() {
        return mentorHighlightOptionJpaRepository.findAll().stream()
                .sorted(Comparator.comparing(option -> option.getName().toLowerCase()))
                .map(option -> new MentorOptionDetail(option.getId(), option.getName(), option.getDescription()))
                .toList();
    }

    @Override
    public MentorTraitsDetail findMentorTraits(Long mentorId) {
        List<MentorOptionDetail> personalities = mentorPersonalityJpaRepository.findOptionsByMentorId(mentorId).stream()
                .map(this::toOptionDetail)
                .toList();
        List<MentorOptionDetail> highlights = mentorHighlightJpaRepository.findOptionsByMentorId(mentorId).stream()
                .map(this::toOptionDetail)
                .toList();
        return new MentorTraitsDetail(personalities, highlights);
    }

    @Override
    public List<MentorAchievementDetail> findMentorAchievements(Long mentorId) {
        return mentorAchievementJpaRepository.findByMentorIdOrderByAchievedAtDescIdDesc(mentorId).stream()
                .map(this::toAchievementDetail)
                .toList();
    }

    @Override
    public List<MentorAvailabilityDetail> findMentorAvailabilities(Long mentorId) {
        return mentorAvailabilityJpaRepository
                .findByMentorIdOrderByAvailabilityTypeAscDayOfWeekAscAvailableDateAscStartTimeAsc(mentorId)
                .stream()
                .map(this::toAvailabilityDetail)
                .toList();
    }

    private MentorListItem toListItem(MentorListItemProjection projection) {
        return new MentorListItem(projection.getId(), projection.getUserId(), projection.getFullName(),
                projection.getAvatarUrl(), projection.getGender(), projection.getHeadline(),
                projection.getExperienceYears(), projection.getCurrentPosition(), projection.getWorkplace(),
                projection.getEducation(), projection.getMajor(), projection.getMeetingType(), projection.getMinPrice(),
                projection.getCreatedAt());
    }

    private AdminMentorListItem toAdminListItem(AdminMentorListItemProjection projection) {
        return new AdminMentorListItem(projection.getId(), projection.getUserId(), projection.getFullName(),
                projection.getAvatarUrl(), projection.getGender(), projection.getHeadline(),
                projection.getExperienceYears(), projection.getCurrentPosition(), projection.getWorkplace(),
                projection.getEducation(), projection.getMajor(), projection.getMeetingType(),
                projection.getApprovalStatus(), projection.getMinPrice(), projection.getCreatedAt());
    }

    private AdminMentorDetail toAdminDetail(AdminMentorDetailProjection projection) {
        return new AdminMentorDetail(projection.getId(), projection.getUserId(), projection.getFullName(),
                projection.getEmail(), projection.getPhone(), projection.getAvatarUrl(), projection.getGender(),
                projection.getHometownCityId(), projection.getHometownCityName(), projection.getCurrentCityId(),
                projection.getCurrentCityName(), projection.getCurrentDistrictId(),
                projection.getCurrentDistrictName(), projection.getHeadline(), projection.getIntroduction(),
                projection.getTeachingStyle(), projection.getExperienceYears(), projection.getCurrentPosition(),
                projection.getWorkplace(), projection.getEducation(), projection.getMajor(),
                projection.getMeetingType(), projection.getApprovalStatus(), projection.getApprovalNote(),
                projection.getCreatedAt(), projection.getUpdatedAt());
    }

    private AdminMentorVerificationListItem toAdminVerificationListItem(AdminMentorVerificationListProjection projection) {
        return new AdminMentorVerificationListItem(projection.getId(), projection.getMentorId(),
                projection.getUserId(), projection.getAccountFullName(), projection.getAccountEmail(),
                projection.getVerificationStatus(), projection.getCreatedAt(), projection.getUpdatedAt());
    }

    private AdminMentorVerificationDetail toAdminVerificationDetail(AdminMentorVerificationDetailProjection projection) {
        return new AdminMentorVerificationDetail(projection.getId(), projection.getMentorId(),
                projection.getUserId(), projection.getAccountFullName(), projection.getAccountEmail(),
                projection.getAccountPhone(), projection.getApprovalStatus(), projection.getApprovalNote(),
                projection.getFullName(), projection.getIdCardNumber(), projection.getIdCardFrontUrl(),
                projection.getIdCardBackUrl(), projection.getSelfieWithIdUrl(),
                projection.getVerificationStatus(), projection.getVerifiedBy(), projection.getVerifiedAt(),
                projection.getRejectionReason(), projection.getCreatedAt(), projection.getUpdatedAt());
    }

    private MentorDetail toDetail(MentorDetailProjection projection) {
        return new MentorDetail(projection.getId(), projection.getUserId(), projection.getFullName(),
                projection.getAvatarUrl(), projection.getGender(), projection.getHometownCityId(),
                projection.getHometownCityName(), projection.getCurrentCityId(), projection.getCurrentCityName(),
                projection.getCurrentDistrictId(), projection.getCurrentDistrictName(), projection.getHeadline(),
                projection.getIntroduction(), projection.getTeachingStyle(), projection.getExperienceYears(),
                projection.getCurrentPosition(), projection.getWorkplace(), projection.getEducation(),
                projection.getMajor(), projection.getMeetingType(), projection.getCreatedAt(), projection.getUpdatedAt());
    }

    private CurrentMentorDetails toCurrentMentorDetails(CurrentMentorDetailsProjection projection) {
        return new CurrentMentorDetails(projection.getId(), projection.getUserId(), projection.getFullName(),
                projection.getAvatarUrl(), projection.getAvatarMediaId(), projection.getGender(), projection.getHometownCityId(),
                projection.getHometownCityName(), projection.getCurrentCityId(), projection.getCurrentCityName(),
                projection.getCurrentDistrictId(), projection.getCurrentDistrictName(), projection.getHeadline(),
                projection.getIntroduction(), projection.getTeachingStyle(), projection.getExperienceYears(),
                projection.getCurrentPosition(), projection.getWorkplace(), projection.getEducation(),
                projection.getMajor(), projection.getMeetingType(), projection.getApprovalStatus(),
                projection.getApprovalNote(), projection.getVerificationStatus(),
                projection.getVerificationRejectionReason(), projection.getCreatedAt(), projection.getUpdatedAt());
    }

    private MentorSubjectDetail toSubjectDetail(MentorSubjectDetailProjection projection) {
        return new MentorSubjectDetail(projection.getId(), projection.getSubjectGradeId(), projection.getSubjectId(),
                projection.getSubjectName(), projection.getGradeId(), projection.getGradeName(),
                projection.getProficiencyLevel(), projection.getTeachingNote(), projection.getPricePerHour(),
                projection.getActive());
    }

    private MentorOptionDetail toOptionDetail(MentorOptionProjection projection) {
        return new MentorOptionDetail(projection.getId(), projection.getName(), projection.getDescription());
    }

    private MentorAchievementDetail toAchievementDetail(MentorAchievementJpaEntity entity) {
        return new MentorAchievementDetail(entity.getId(), entity.getTitle(), entity.getDescription(),
                entity.getAchievementType(), entity.getIssuer(), entity.getAchievedAt(), entity.getProofUrl(),
                entity.getVerified());
    }

    private MentorAvailabilityDetail toAvailabilityDetail(MentorAvailabilityJpaEntity entity) {
        return new MentorAvailabilityDetail(entity.getId(), entity.getAvailabilityType(), entity.getDayOfWeek(),
                entity.getAvailableDate(), entity.getStartTime(), entity.getEndTime());
    }

    private String containsPattern(String value) {
        return StringUtils.hasText(value) ? "%" + value.trim().toLowerCase() + "%" : null;
    }
}
