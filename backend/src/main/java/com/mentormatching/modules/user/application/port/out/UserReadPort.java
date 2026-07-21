package com.mentormatching.modules.user.application.port.out;

import java.util.Optional;

import com.mentormatching.modules.user.application.dto.AdminUserListItem;
import com.mentormatching.modules.user.application.dto.GetAdminUsersQuery;
import com.mentormatching.modules.user.domain.User;
import com.mentormatching.shared.response.PageResponse;

public interface UserReadPort {

    Optional<User> findById(Long userId);

    Optional<User> findByEmail(String email);

    PageResponse<AdminUserListItem> findAdminUsers(GetAdminUsersQuery query);
}
