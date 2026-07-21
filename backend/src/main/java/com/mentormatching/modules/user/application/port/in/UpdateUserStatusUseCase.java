package com.mentormatching.modules.user.application.port.in;

import com.mentormatching.modules.user.application.dto.AdminUserDetail;
import com.mentormatching.modules.user.application.dto.UpdateUserStatusCommand;

public interface UpdateUserStatusUseCase {

    AdminUserDetail updateUserStatus(UpdateUserStatusCommand command);
}
