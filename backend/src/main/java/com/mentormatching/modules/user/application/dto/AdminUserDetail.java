package com.mentormatching.modules.user.application.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.mentormatching.modules.user.domain.UserRole;
import com.mentormatching.modules.user.domain.UserStatus;
import com.mentormatching.modules.user.domain.UserType;

public record AdminUserDetail(Long id, String fullName, String email, String phone, UserRole role,
                              UserType userType, UserStatus status, LocalDateTime createdAt, long totalBookings,
                              BigDecimal totalSpent) {
}
