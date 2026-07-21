package com.mentormatching.modules.user.application.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mentormatching.modules.user.application.dto.AdminUserDetail;
import com.mentormatching.modules.user.application.dto.UpdateUserStatusCommand;
import com.mentormatching.modules.user.application.port.in.GetAdminUserDetailUseCase;
import com.mentormatching.modules.user.application.port.in.UpdateUserStatusUseCase;
import com.mentormatching.modules.user.application.port.out.UserReadPort;
import com.mentormatching.modules.user.application.port.out.UserRepositoryPort;
import com.mentormatching.modules.user.domain.User;
import com.mentormatching.modules.user.domain.UserRole;
import com.mentormatching.shared.exception.InvalidDataException;
import com.mentormatching.shared.exception.ResourceNotFoundException;

@Service
public class AdminUserManagementService implements UpdateUserStatusUseCase {

    private final UserReadPort userReadPort;
    private final UserRepositoryPort userRepositoryPort;
    private final GetAdminUserDetailUseCase getAdminUserDetailUseCase;

    public AdminUserManagementService(UserReadPort userReadPort, UserRepositoryPort userRepositoryPort,
                                      GetAdminUserDetailUseCase getAdminUserDetailUseCase) {
        this.userReadPort = userReadPort;
        this.userRepositoryPort = userRepositoryPort;
        this.getAdminUserDetailUseCase = getAdminUserDetailUseCase;
    }

    @Override
    @Transactional
    public AdminUserDetail updateUserStatus(UpdateUserStatusCommand command) {
        User user = userReadPort.findById(command.userId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.getRole() == UserRole.ADMIN) {
            throw new InvalidDataException("Cannot change status of an admin account");
        }

        switch (command.action()) {
            case BAN -> user.ban();
            case ACTIVATE -> user.activate();
        }

        userRepositoryPort.save(user);
        return getAdminUserDetailUseCase.getAdminUserDetail(user.getId());
    }
}
