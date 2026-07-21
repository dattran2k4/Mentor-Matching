package com.mentormatching.modules.user.presentation.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.mentormatching.modules.user.application.dto.AdminUserDetail;
import com.mentormatching.modules.user.domain.UserRole;
import com.mentormatching.modules.user.domain.UserStatus;
import com.mentormatching.modules.user.domain.UserType;

public record AdminUserDetailResponse(Long id, String fullName, String email, String phone, UserRole role,
                                      UserType userType, UserStatus status, LocalDateTime createdAt,
                                      long totalBookings, BigDecimal totalSpent) {

    public static AdminUserDetailResponse from(AdminUserDetail detail) {
        return new AdminUserDetailResponse(detail.id(), detail.fullName(), detail.email(), detail.phone(),
                detail.role(), detail.userType(), detail.status(), detail.createdAt(), detail.totalBookings(),
                detail.totalSpent());
    }
}
