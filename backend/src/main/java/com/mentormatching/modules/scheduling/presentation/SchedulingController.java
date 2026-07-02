package com.mentormatching.modules.scheduling.presentation;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mentormatching.modules.scheduling.application.port.in.CreateCurrentMentorAvailabilityUseCase;
import com.mentormatching.modules.scheduling.application.dto.CurrentMentorAvailabilityDetail;
import com.mentormatching.modules.scheduling.application.port.in.DeleteCurrentMentorAvailabilityUseCase;
import com.mentormatching.modules.scheduling.application.port.in.GetCurrentMentorAvailabilitiesUseCase;
import com.mentormatching.modules.scheduling.presentation.dto.request.CreateCurrentMentorAvailabilityRequest;
import com.mentormatching.modules.scheduling.application.port.in.UpdateCurrentMentorAvailabilityUseCase;
import com.mentormatching.modules.scheduling.presentation.dto.request.UpdateCurrentMentorAvailabilityRequest;
import com.mentormatching.modules.scheduling.presentation.dto.response.CreateCurrentMentorAvailabilityResponse;
import com.mentormatching.modules.scheduling.presentation.dto.response.CurrentMentorAvailabilityResponse;
import com.mentormatching.shared.response.ApiResponse;
import com.mentormatching.shared.response.ApiResponseFactory;
import com.mentormatching.shared.security.model.AuthenticatedPrincipal;

import jakarta.validation.Valid;

@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping("/api/v1/scheduling")
public class SchedulingController {

    private final GetCurrentMentorAvailabilitiesUseCase getCurrentMentorAvailabilitiesUseCase;
    private final CreateCurrentMentorAvailabilityUseCase createCurrentMentorAvailabilityUseCase;
    private final UpdateCurrentMentorAvailabilityUseCase updateCurrentMentorAvailabilityUseCase;
    private final DeleteCurrentMentorAvailabilityUseCase deleteCurrentMentorAvailabilityUseCase;
    private final ApiResponseFactory apiResponseFactory;

    @GetMapping("/me/availabilities")
    public ApiResponse<List<CurrentMentorAvailabilityResponse>> getCurrentMentorAvailabilities(
            @AuthenticationPrincipal AuthenticatedPrincipal principal) {
        List<CurrentMentorAvailabilityDetail> availabilities = getCurrentMentorAvailabilitiesUseCase
                .getCurrentMentorAvailabilities(principal.getId());
        return apiResponseFactory.success(
                availabilities.stream().map(CurrentMentorAvailabilityResponse::from).toList(),
                "Get current mentor availabilities successfully");
    }

    @PostMapping("/me/availabilities")
    public ApiResponse<CreateCurrentMentorAvailabilityResponse> createCurrentMentorAvailability(
            @AuthenticationPrincipal AuthenticatedPrincipal principal,
            @Valid @RequestBody CreateCurrentMentorAvailabilityRequest request) {
        Long availabilityId = createCurrentMentorAvailabilityUseCase
                .createCurrentMentorAvailability(request.toCommand(principal));
        return apiResponseFactory.created(CreateCurrentMentorAvailabilityResponse.from(availabilityId),
                "Create current mentor availability successfully");
    }

    @PutMapping("/me/availabilities/{availabilityId}")
    public ApiResponse<Void> updateCurrentMentorAvailability(
            @AuthenticationPrincipal AuthenticatedPrincipal principal,
            @PathVariable Long availabilityId,
            @Valid @RequestBody UpdateCurrentMentorAvailabilityRequest request) {
        updateCurrentMentorAvailabilityUseCase.updateCurrentMentorAvailability(
                request.toCommand(principal, availabilityId));
        return apiResponseFactory.success(null, "Update current mentor availability successfully");
    }

    @DeleteMapping("/me/availabilities/{availabilityId}")
    public ApiResponse<Void> deleteCurrentMentorAvailability(
            @AuthenticationPrincipal AuthenticatedPrincipal principal,
            @PathVariable Long availabilityId) {
        deleteCurrentMentorAvailabilityUseCase.deleteCurrentMentorAvailability(principal.getId(), availabilityId);
        return apiResponseFactory.success(null, "Delete current mentor availability successfully");
    }
}
