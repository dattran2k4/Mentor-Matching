package com.mentormatching.modules.user.presentation;

import static com.mentormatching.shared.response.PageQueryDefaults.DEFAULT_PAGE;
import static com.mentormatching.shared.response.PageQueryDefaults.DEFAULT_SIZE;
import static com.mentormatching.shared.response.PageQueryDefaults.DEFAULT_SORT_BY;
import static com.mentormatching.shared.response.PageQueryDefaults.DEFAULT_SORT_DIR;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mentormatching.modules.user.application.dto.AdminUserDetail;
import com.mentormatching.modules.user.application.dto.AdminUserListItem;
import com.mentormatching.modules.user.application.dto.GetAdminUsersQuery;
import com.mentormatching.modules.user.application.port.in.GetAdminUserDetailUseCase;
import com.mentormatching.modules.user.application.port.in.GetAdminUsersUseCase;
import com.mentormatching.modules.user.application.port.in.UpdateUserStatusUseCase;
import com.mentormatching.modules.user.domain.UserRole;
import com.mentormatching.modules.user.domain.UserStatus;
import com.mentormatching.modules.user.presentation.dto.request.UpdateUserStatusRequest;
import com.mentormatching.modules.user.presentation.dto.response.AdminUserDetailResponse;
import com.mentormatching.modules.user.presentation.dto.response.AdminUserListItemResponse;
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
@RequestMapping("/api/v1/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final GetAdminUsersUseCase getAdminUsersUseCase;
    private final GetAdminUserDetailUseCase getAdminUserDetailUseCase;
    private final UpdateUserStatusUseCase updateUserStatusUseCase;
    private final ApiResponseFactory apiResponseFactory;

    @GetMapping
    public ApiResponse<PageResponse<AdminUserListItemResponse>> getAdminUsers(
            @RequestParam(defaultValue = DEFAULT_PAGE) @Min(1) int page,
            @RequestParam(defaultValue = DEFAULT_SIZE) @Min(1) @Max(100) int size,
            @RequestParam(defaultValue = DEFAULT_SORT_BY) String sortBy,
            @RequestParam(defaultValue = DEFAULT_SORT_DIR) String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UserRole role,
            @RequestParam(required = false) UserStatus status) {
        PageResponse<AdminUserListItem> users = getAdminUsersUseCase.getAdminUsers(
                new GetAdminUsersQuery(page, size, sortBy, sortDir, search, role, status));
        return apiResponseFactory.success(AdminUserListItemResponse.from(users), "Get admin users successfully");
    }

    @GetMapping("/{userId}")
    public ApiResponse<AdminUserDetailResponse> getAdminUserDetail(@PathVariable Long userId) {
        AdminUserDetail user = getAdminUserDetailUseCase.getAdminUserDetail(userId);
        return apiResponseFactory.success(AdminUserDetailResponse.from(user), "Get admin user detail successfully");
    }

    @PatchMapping("/{userId}/status")
    public ApiResponse<AdminUserDetailResponse> updateUserStatus(
            @AuthenticationPrincipal AuthenticatedPrincipal principal,
            @PathVariable Long userId,
            @Valid @RequestBody UpdateUserStatusRequest request) {
        AdminUserDetail user = updateUserStatusUseCase.updateUserStatus(request.toCommand(principal, userId));
        return apiResponseFactory.success(AdminUserDetailResponse.from(user), "Update user status successfully");
    }
}
