package com.mentormatching.modules.user.application.port.in;

import com.mentormatching.modules.user.application.dto.AdminUserDetail;

public interface GetAdminUserDetailUseCase {

    AdminUserDetail getAdminUserDetail(Long userId);
}
