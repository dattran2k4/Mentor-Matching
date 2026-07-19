package com.mentormatching.modules.user.application.dto;

import com.mentormatching.modules.user.domain.UserRole;
import com.mentormatching.modules.user.domain.UserStatus;

public record GetAdminUsersQuery(int page, int size, String sortBy, String sortDir, String search, UserRole role,
                                 UserStatus status) {
}
