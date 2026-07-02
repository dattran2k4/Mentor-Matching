package com.mentormatching.modules.media.presentation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mentormatching.modules.media.application.dto.MediaAssetDetails;
import com.mentormatching.modules.media.application.dto.MediaUploadIntent;
import com.mentormatching.modules.media.application.port.in.ConfirmMediaUploadUseCase;
import com.mentormatching.modules.media.application.port.in.CreateMediaUploadUseCase;
import com.mentormatching.modules.media.presentation.dto.request.ConfirmMediaUploadRequest;
import com.mentormatching.modules.media.presentation.dto.request.CreateMediaUploadIntentRequest;
import com.mentormatching.modules.media.presentation.dto.response.MediaAssetResponse;
import com.mentormatching.modules.media.presentation.dto.response.MediaUploadIntentResponse;
import com.mentormatching.shared.response.ApiResponse;
import com.mentormatching.shared.response.ApiResponseFactory;
import com.mentormatching.shared.security.model.AuthenticatedPrincipal;

import jakarta.validation.Valid;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/media")
@Slf4j(topic = "MEDIA-CONTROLLER")
public class MediaController {

    private final CreateMediaUploadUseCase createMediaUploadUseCase;
    private final ConfirmMediaUploadUseCase confirmMediaUploadUseCase;
    private final ApiResponseFactory apiResponseFactory;

    @PostMapping("/upload-intents")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<MediaUploadIntentResponse> createUploadIntent(@AuthenticationPrincipal AuthenticatedPrincipal principal,
                                                                     @Valid @RequestBody CreateMediaUploadIntentRequest request) {
        log.info("Received request to create media upload intent for userId {}", principal.getId());
        MediaUploadIntent uploadIntent = createMediaUploadUseCase.createUpload(request.toCommand(principal));
        return apiResponseFactory.created(MediaUploadIntentResponse.from(uploadIntent),
                "Create media upload intent successfully");
    }

    @PostMapping("/{mediaAssetId}/confirm")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<MediaAssetResponse> confirmUpload(@AuthenticationPrincipal AuthenticatedPrincipal principal,
                                                         @PathVariable Long mediaAssetId,
                                                         @Valid @RequestBody ConfirmMediaUploadRequest request) {
        log.info("Received request to confirm media upload mediaAssetId {} for userId {}", mediaAssetId,
                principal.getId());
        MediaAssetDetails mediaAsset = confirmMediaUploadUseCase.confirmUpload(request.toCommand(principal,
                mediaAssetId));
        return apiResponseFactory.success(MediaAssetResponse.from(mediaAsset), "Confirm media upload successfully");
    }
}
