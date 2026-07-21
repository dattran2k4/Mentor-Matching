package com.mentormatching.modules.user.application.port.in;

import com.mentormatching.modules.user.application.dto.AdminUserListItem;
import com.mentormatching.modules.user.application.dto.GetAdminUsersQuery;
import com.mentormatching.shared.response.PageResponse;

public interface GetAdminUsersUseCase {

    PageResponse<AdminUserListItem> getAdminUsers(GetAdminUsersQuery query);
}
