package com.mentormatching.modules.mentor.presentation;

import static com.mentormatching.shared.response.PageQueryDefaults.DEFAULT_PAGE;
import static com.mentormatching.shared.response.PageQueryDefaults.DEFAULT_SIZE;
import static com.mentormatching.shared.response.PageQueryDefaults.DEFAULT_SORT_BY;
import static com.mentormatching.shared.response.PageQueryDefaults.DEFAULT_SORT_DIR;

import java.util.Collections;
import java.util.List;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mentormatching.modules.mentor.application.dto.GetMentorsQuery;
import com.mentormatching.modules.mentor.application.dto.MentorDetail;
import com.mentormatching.modules.mentor.application.dto.MentorListItem;
import com.mentormatching.modules.mentor.application.port.in.CreateCurrentMentorUseCase;
import com.mentormatching.modules.mentor.application.port.in.GetCurrentMentorOnboardingStatusUseCase;
import com.mentormatching.modules.mentor.application.port.in.GetCurrentMentorUseCase;
import com.mentormatching.modules.mentor.application.port.in.GetMentorDetailUseCase;
import com.mentormatching.modules.mentor.application.port.in.GetMentorsUseCase;
import com.mentormatching.modules.mentor.application.port.in.SubmitCurrentMentorApplicationUseCase;
import com.mentormatching.modules.mentor.application.port.in.UpdateCurrentMentorAvatarUseCase;
import com.mentormatching.modules.mentor.application.port.in.UpdateCurrentMentorUseCase;
import com.mentormatching.modules.mentor.domain.Gender;
import com.mentormatching.modules.mentor.domain.MeetingType;
import com.mentormatching.modules.mentor.presentation.dto.request.UpdateCurrentMentorRequest;
import com.mentormatching.modules.mentor.presentation.dto.request.UpdateCurrentMentorAvatarRequest;
import com.mentormatching.modules.mentor.presentation.dto.response.CurrentMentorOnboardingStatusResponse;
import com.mentormatching.modules.mentor.presentation.dto.response.CurrentMentorResponse;
import com.mentormatching.modules.mentor.presentation.dto.response.MentorDetailResponse;
import com.mentormatching.modules.mentor.presentation.dto.response.MentorListItemResponse;
import com.mentormatching.shared.response.ApiResponse;
import com.mentormatching.shared.response.ApiResponseFactory;
import com.mentormatching.shared.response.PageResponse;
import com.mentormatching.shared.security.model.AuthenticatedPrincipal;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

@RestController
@RequiredArgsConstructor
@Validated
@Slf4j
@RequestMapping("/api/v1/mentors")
public class MentorController {

    private final CreateCurrentMentorUseCase createCurrentMentorUseCase;
    private final GetCurrentMentorOnboardingStatusUseCase getCurrentMentorOnboardingStatusUseCase;
    private final SubmitCurrentMentorApplicationUseCase submitCurrentMentorApplicationUseCase;
    private final GetCurrentMentorUseCase getCurrentMentorUseCase;
    private final UpdateCurrentMentorUseCase updateCurrentMentorUseCase;
    private final UpdateCurrentMentorAvatarUseCase updateCurrentMentorAvatarUseCase;
    private final GetMentorsUseCase getMentorsUseCase;
    private final GetMentorDetailUseCase getMentorDetailUseCase;
    private final ApiResponseFactory apiResponseFactory;

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/me")
    public ApiResponse<CurrentMentorResponse> createCurrentMentor(
            @AuthenticationPrincipal AuthenticatedPrincipal principal,
            @Valid @RequestBody UpdateCurrentMentorRequest request) {
        return apiResponseFactory.success(CurrentMentorResponse.from(createCurrentMentorUseCase.createCurrentMentor(
                request.toCommand(principal))), "Create mentor profile successfully");
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ApiResponse<CurrentMentorResponse> getCurrentMentor(
            @AuthenticationPrincipal AuthenticatedPrincipal principal) {
        return apiResponseFactory.success(CurrentMentorResponse.from(getCurrentMentorUseCase.getCurrentMentor(
                principal.getId())), "Get current mentor profile successfully");
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me/onboarding-status")
    public ApiResponse<CurrentMentorOnboardingStatusResponse> getCurrentMentorOnboardingStatus(
            @AuthenticationPrincipal AuthenticatedPrincipal principal) {
        return apiResponseFactory.success(CurrentMentorOnboardingStatusResponse.from(
                getCurrentMentorOnboardingStatusUseCase.getCurrentMentorOnboardingStatus(principal.getId())),
                "Get current mentor onboarding status successfully");
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/me/submission")
    public ApiResponse<CurrentMentorOnboardingStatusResponse> submitCurrentMentorApplication(
            @AuthenticationPrincipal AuthenticatedPrincipal principal) {
        return apiResponseFactory.success(CurrentMentorOnboardingStatusResponse.from(
                submitCurrentMentorApplicationUseCase.submitCurrentMentorApplication(principal.getId())),
                "Submit current mentor application successfully");
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/me")
    public ApiResponse<CurrentMentorResponse> updateCurrentMentor(
            @AuthenticationPrincipal AuthenticatedPrincipal principal,
            @Valid @RequestBody UpdateCurrentMentorRequest request) {
        return apiResponseFactory.success(CurrentMentorResponse.from(updateCurrentMentorUseCase.updateCurrentMentor(
                request.toCommand(principal))), "Update mentor profile successfully");
    }

    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/me/avatar")
    public ApiResponse<CurrentMentorResponse> updateCurrentMentorAvatar(
            @AuthenticationPrincipal AuthenticatedPrincipal principal,
            @Valid @RequestBody UpdateCurrentMentorAvatarRequest request) {
        return apiResponseFactory.success(CurrentMentorResponse.from(
                updateCurrentMentorAvatarUseCase.updateCurrentMentorAvatar(request.toCommand(principal))),
                "Update mentor avatar successfully");
    }

    @GetMapping
    public ApiResponse<PageResponse<MentorListItemResponse>> getMentors(@RequestParam(defaultValue = DEFAULT_PAGE) @Min(1) int page,
                                                                        @RequestParam(defaultValue = DEFAULT_SIZE) @Min(1) @Max(100) int size,
                                                                        @RequestParam(defaultValue = DEFAULT_SORT_BY) String sortBy,
                                                                        @RequestParam(defaultValue = DEFAULT_SORT_DIR) String sortDir,
                                                                        @RequestParam(required = false) String search,
                                                                        @RequestParam(required = false) Gender gender,
                                                                        @RequestParam(required = false) MeetingType meetingType,
                                                                        @RequestParam(required = false) Long cityId,
                                                                        @RequestParam(required = false) Long districtId,
                                                                        @RequestParam(required = false) Long subjectId,
                                                                        @RequestParam(required = false) Long gradeId) {
        PageResponse<MentorListItem> mentors = getMentorsUseCase.getMentors(new GetMentorsQuery(page, size, sortBy,
                sortDir, search, gender, meetingType, cityId, districtId, subjectId, gradeId));
        return apiResponseFactory.success(MentorListItemResponse.from(mentors), "Get mentors successfully");
    }

    @GetMapping("/{id}")
    public ApiResponse<MentorDetailResponse> getMentorDetail(@PathVariable Long id) {
        MentorDetail mentor = getMentorDetailUseCase.getMentorDetail(id);
        return apiResponseFactory.success(MentorDetailResponse.from(mentor), "Get mentor detail successfully");
    }
}
