package com.mentormatching.modules.mentor.presentation;

import java.util.List;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mentormatching.modules.mentor.application.dto.MentorSubjectDetail;
import com.mentormatching.modules.mentor.application.port.in.DeleteCurrentMentorSubjectUseCase;
import com.mentormatching.modules.mentor.application.port.in.GetCurrentMentorSubjectsUseCase;
import com.mentormatching.modules.mentor.application.port.in.GetMentorSubjectsUseCase;
import com.mentormatching.modules.mentor.application.port.in.UpsertCurrentMentorSubjectUseCase;
import com.mentormatching.modules.mentor.presentation.dto.request.UpsertCurrentMentorSubjectRequest;
import com.mentormatching.modules.mentor.presentation.dto.response.MentorSubjectDetailResponse;
import com.mentormatching.shared.response.ApiResponse;
import com.mentormatching.shared.response.ApiResponseFactory;
import com.mentormatching.shared.security.model.AuthenticatedPrincipal;

import jakarta.validation.Valid;

@RestController
@RequiredArgsConstructor
@Validated
@Slf4j
@RequestMapping("/api/v1/mentors")
public class MentorSubjectController {

    private final GetCurrentMentorSubjectsUseCase getCurrentMentorSubjectsUseCase;
    private final UpsertCurrentMentorSubjectUseCase upsertCurrentMentorSubjectUseCase;
    private final DeleteCurrentMentorSubjectUseCase deleteCurrentMentorSubjectUseCase;
    private final GetMentorSubjectsUseCase getMentorSubjectsUseCase;
    private final ApiResponseFactory apiResponseFactory;

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me/subjects")
    public ApiResponse<List<MentorSubjectDetailResponse>> getCurrentMentorSubjects(
            @AuthenticationPrincipal AuthenticatedPrincipal principal) {
        List<MentorSubjectDetail> subjects = getCurrentMentorSubjectsUseCase.getCurrentMentorSubjects(
                principal.getId());
        return apiResponseFactory.success(subjects.stream().map(MentorSubjectDetailResponse::from).toList(),
                "Get current mentor subjects successfully");
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/me/subjects")
    public ApiResponse<MentorSubjectDetailResponse> upsertCurrentMentorSubject(
            @AuthenticationPrincipal AuthenticatedPrincipal principal,
            @Valid @RequestBody UpsertCurrentMentorSubjectRequest request) {
        log.info("Request for Upsert subject + grade for mentor");
        return apiResponseFactory.success(MentorSubjectDetailResponse.from(
                        upsertCurrentMentorSubjectUseCase.upsertCurrentMentorSubject(request.toCommand(principal))),
                "Save current mentor subject successfully");
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/me/subjects/{mentorSubjectId}")
    public ApiResponse<Void> deleteCurrentMentorSubject(
            @AuthenticationPrincipal AuthenticatedPrincipal principal,
            @PathVariable Long mentorSubjectId) {
        deleteCurrentMentorSubjectUseCase.deleteCurrentMentorSubject(principal.getId(), mentorSubjectId);
        return apiResponseFactory.success(null, "Delete current mentor subject successfully");
    }

    @GetMapping("/{id}/subjects")
    public ApiResponse<List<MentorSubjectDetailResponse>> getMentorSubjects(@PathVariable Long id) {
        List<MentorSubjectDetail> subjects = getMentorSubjectsUseCase.getMentorSubjects(id);
        return apiResponseFactory.success(subjects.stream().map(MentorSubjectDetailResponse::from).toList(),
                "Get mentor subjects successfully");
    }
}
