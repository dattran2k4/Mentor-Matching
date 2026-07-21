package com.mentormatching.modules.user.presentation.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.mentormatching.modules.user.application.dto.AdminUserListItem;
import com.mentormatching.modules.user.domain.UserRole;
import com.mentormatching.modules.user.domain.UserStatus;
import com.mentormatching.modules.user.domain.UserType;
import com.mentormatching.shared.response.PageResponse;

public record AdminUserListItemResponse(Long id, String fullName, String email, String phone, UserRole role,
                                        UserType userType, UserStatus status, LocalDateTime createdAt) {

    public static AdminUserListItemResponse from(AdminUserListItem item) {
        return new AdminUserListItemResponse(item.id(), item.fullName(), item.email(), item.phone(), item.role(),
                item.userType(), item.status(), item.createdAt());
    }

    public static PageResponse<AdminUserListItemResponse> from(PageResponse<AdminUserListItem> items) {
        List<AdminUserListItemResponse> data = items.getData().stream()
                .map(AdminUserListItemResponse::from)
                .toList();
        return PageResponse.<AdminUserListItemResponse>builder()
                .page(items.getPage())
                .pageSize(items.getPageSize())
                .totalPages(items.getTotalPages())
                .totalItems(items.getTotalItems())
                .data(data)
                .build();
    }
}
