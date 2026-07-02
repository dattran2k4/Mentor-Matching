package com.mentormatching.modules.mentor.application.service;

import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Service;

import com.mentormatching.modules.mentor.application.dto.CurrentMentorDetails;
import com.mentormatching.modules.mentor.application.dto.GetMentorsQuery;
import com.mentormatching.modules.mentor.application.dto.MentorAchievementDetail;
import com.mentormatching.modules.mentor.application.dto.MentorAvailabilityDetail;
import com.mentormatching.modules.mentor.application.dto.MentorDetail;
import com.mentormatching.modules.mentor.application.dto.MentorListItem;
import com.mentormatching.modules.mentor.application.dto.MentorOptionDetail;
import com.mentormatching.modules.mentor.application.dto.MentorSubjectDetail;
import com.mentormatching.modules.mentor.application.dto.MentorSubjectSummary;
import com.mentormatching.modules.mentor.application.dto.MentorSummary;
import com.mentormatching.modules.mentor.application.dto.MentorTraitsDetail;
import com.mentormatching.modules.mentor.application.port.in.GetMentorAchievementsUseCase;
import com.mentormatching.modules.mentor.application.port.in.GetMentorAvailabilitiesUseCase;
import com.mentormatching.modules.mentor.application.port.in.GetCurrentMentorAchievementsUseCase;
import com.mentormatching.modules.mentor.application.port.in.GetCurrentMentorUseCase;
import com.mentormatching.modules.mentor.application.port.in.GetCurrentMentorSubjectsUseCase;
import com.mentormatching.modules.mentor.application.port.in.GetHighlightOptionsUseCase;
import com.mentormatching.modules.mentor.application.port.in.GetMentorDetailUseCase;
import com.mentormatching.modules.mentor.application.port.in.GetMentorSubjectsUseCase;
import com.mentormatching.modules.mentor.application.port.in.GetMentorSubjectSummaryUseCase;
import com.mentormatching.modules.mentor.application.port.in.GetMentorSummaryByUserUseCase;
import com.mentormatching.modules.mentor.application.port.in.GetMentorTraitsUseCase;
import com.mentormatching.modules.mentor.application.port.in.GetMentorsUseCase;
import com.mentormatching.modules.mentor.application.port.in.GetMentorSummaryUseCase;
import com.mentormatching.modules.mentor.application.port.in.GetPersonalityOptionsUseCase;
import com.mentormatching.modules.mentor.application.port.out.MentorCatalogLookupPort;
import com.mentormatching.modules.mentor.application.port.out.MentorProfileRepositoryPort;
import com.mentormatching.modules.mentor.application.port.out.MentorReadRepositoryPort;
import com.mentormatching.modules.mentor.application.port.out.MentorSubjectRepositoryPort;
import com.mentormatching.modules.mentor.domain.MentorProfile;
import com.mentormatching.modules.mentor.domain.MentorSubject;
import com.mentormatching.shared.exception.ResourceNotFoundException;
import com.mentormatching.shared.response.PageResponse;

@Service
public class MentorQueryService implements GetMentorSummaryUseCase, GetMentorSubjectSummaryUseCase, GetMentorsUseCase,
        GetMentorDetailUseCase, GetMentorSubjectsUseCase, GetMentorTraitsUseCase, GetMentorAchievementsUseCase,
        GetMentorAvailabilitiesUseCase, GetMentorSummaryByUserUseCase, GetCurrentMentorUseCase,
        GetCurrentMentorAchievementsUseCase,
        GetCurrentMentorSubjectsUseCase, GetPersonalityOptionsUseCase, GetHighlightOptionsUseCase {

    private final MentorProfileRepositoryPort mentorProfileRepositoryPort;
    private final MentorSubjectRepositoryPort mentorSubjectRepositoryPort;
    private final MentorReadRepositoryPort mentorReadRepositoryPort;
    private final MentorCatalogLookupPort mentorCatalogLookupPort;

    public MentorQueryService(MentorProfileRepositoryPort mentorProfileRepositoryPort,
                              MentorSubjectRepositoryPort mentorSubjectRepositoryPort,
                              MentorReadRepositoryPort mentorReadRepositoryPort,
                              MentorCatalogLookupPort mentorCatalogLookupPort) {
        this.mentorProfileRepositoryPort = mentorProfileRepositoryPort;
        this.mentorSubjectRepositoryPort = mentorSubjectRepositoryPort;
        this.mentorReadRepositoryPort = mentorReadRepositoryPort;
        this.mentorCatalogLookupPort = mentorCatalogLookupPort;
    }

    @Override
    public PageResponse<MentorListItem> getMentors(GetMentorsQuery query) {
        List<Long> subjectGradeIds = null;
        if (query.subjectId() != null || query.gradeId() != null) {
            subjectGradeIds = mentorCatalogLookupPort.getSubjectGradeIds(query.subjectId(), query.gradeId());
            if (subjectGradeIds.isEmpty()) {
                return PageResponse.<MentorListItem>builder()
                        .page(query.page())
                        .pageSize(query.size())
                        .totalItems(0)
                        .totalPages(0)
                        .data(Collections.emptyList())
                        .build();
            }
        }
        return mentorReadRepositoryPort.findApprovedMentors(query, subjectGradeIds);
    }

    @Override
    public MentorDetail getMentorDetail(Long mentorId) {
        return mentorReadRepositoryPort.findApprovedMentorDetailById(mentorId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor profile not found"));
    }

    @Override
    public CurrentMentorDetails getCurrentMentor(Long userId) {
        MentorProfile mentorProfile = mentorProfileRepositoryPort.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor profile not found"));

        return mentorReadRepositoryPort.findCurrentMentorByMentorId(mentorProfile.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Mentor profile not found"));
    }

    @Override
    public List<MentorSubjectDetail> getMentorSubjects(Long mentorId) {
        ensureApprovedMentorExists(mentorId);
        return mentorReadRepositoryPort.findMentorSubjects(mentorId);
    }

    @Override
    public List<MentorSubjectDetail> getCurrentMentorSubjects(Long userId) {
        MentorProfile mentor = mentorProfileRepositoryPort.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor profile not found"));
        return mentorReadRepositoryPort.findAllMentorSubjects(mentor.getId());
    }

    @Override
    public List<MentorOptionDetail> getPersonalityOptions() {
        return mentorReadRepositoryPort.findPersonalityOptions();
    }

    @Override
    public List<MentorOptionDetail> getHighlightOptions() {
        return mentorReadRepositoryPort.findHighlightOptions();
    }

    @Override
    public MentorTraitsDetail getMentorTraits(Long mentorId) {
        ensureApprovedMentorExists(mentorId);
        return mentorReadRepositoryPort.findMentorTraits(mentorId);
    }

    @Override
    public List<MentorAchievementDetail> getMentorAchievements(Long mentorId) {
        ensureApprovedMentorExists(mentorId);
        return mentorReadRepositoryPort.findMentorAchievements(mentorId);
    }

    @Override
    public List<MentorAchievementDetail> getCurrentMentorAchievements(Long userId) {
        MentorProfile mentor = mentorProfileRepositoryPort.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor profile not found"));
        return mentorReadRepositoryPort.findMentorAchievements(mentor.getId());
    }

    @Override
    public List<MentorAvailabilityDetail> getMentorAvailabilities(Long mentorId) {
        ensureApprovedMentorExists(mentorId);
        return mentorReadRepositoryPort.findMentorAvailabilities(mentorId);
    }

    @Override
    public MentorSummary getMentorSummary(Long mentorId) {
        MentorProfile mentor = mentorProfileRepositoryPort.findById(mentorId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor profile not found"));
        return new MentorSummary(mentor.getId(), mentor.getUserId(), mentor.getMeetingType(),
                mentor.getApprovalStatus());
    }

    @Override
    public MentorSummary getMentorSummaryByUserId(Long userId) {
        MentorProfile mentor = mentorProfileRepositoryPort.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor profile not found"));
        return new MentorSummary(mentor.getId(), mentor.getUserId(), mentor.getMeetingType(),
                mentor.getApprovalStatus());
    }

    @Override
    public MentorSubjectSummary getMentorSubjectSummary(Long mentorSubjectId) {
        MentorSubject mentorSubject = mentorSubjectRepositoryPort.findById(mentorSubjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor subject not found"));
        return new MentorSubjectSummary(mentorSubject.getId(), mentorSubject.getMentorId(),
                mentorSubject.getSubjectGradeId(), mentorSubject.getPricePerHour(),
                Boolean.TRUE.equals(mentorSubject.getActive()));
    }

    private void ensureApprovedMentorExists(Long mentorId) {
        if (!mentorReadRepositoryPort.existsApprovedMentorById(mentorId)) {
            throw new ResourceNotFoundException("Mentor profile not found");
        }
    }
}
