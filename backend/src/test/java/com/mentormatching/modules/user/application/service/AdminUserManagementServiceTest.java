package com.mentormatching.modules.user.application.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.mentormatching.modules.user.application.dto.AdminUserDetail;
import com.mentormatching.modules.user.application.dto.UpdateUserStatusAction;
import com.mentormatching.modules.user.application.dto.UpdateUserStatusCommand;
import com.mentormatching.modules.user.application.port.in.GetAdminUserDetailUseCase;
import com.mentormatching.modules.user.application.port.out.UserReadPort;
import com.mentormatching.modules.user.application.port.out.UserRepositoryPort;
import com.mentormatching.modules.user.domain.User;
import com.mentormatching.modules.user.domain.UserRestoreData;
import com.mentormatching.modules.user.domain.UserRole;
import com.mentormatching.modules.user.domain.UserStatus;
import com.mentormatching.modules.user.domain.UserType;
import com.mentormatching.shared.exception.InvalidDataException;
import com.mentormatching.shared.exception.ResourceNotFoundException;

class AdminUserManagementServiceTest {

    private UserReadPort userReadPort;
    private UserRepositoryPort userRepositoryPort;
    private GetAdminUserDetailUseCase getAdminUserDetailUseCase;
    private AdminUserManagementService adminUserManagementService;

    @BeforeEach
    void setUp() {
        userReadPort = mock(UserReadPort.class);
        userRepositoryPort = mock(UserRepositoryPort.class);
        getAdminUserDetailUseCase = mock(GetAdminUserDetailUseCase.class);
        adminUserManagementService = new AdminUserManagementService(userReadPort, userRepositoryPort,
                getAdminUserDetailUseCase);
    }

    @Test
    void updateUserStatusBansActiveLearner() {
        UpdateUserStatusCommand command = new UpdateUserStatusCommand(1L, 10L, UpdateUserStatusAction.BAN);
        User user = learnerUser(UserStatus.ACTIVE);
        AdminUserDetail expected = detailOf(user, UserStatus.BANNED);

        when(userReadPort.findById(10L)).thenReturn(Optional.of(user));
        when(getAdminUserDetailUseCase.getAdminUserDetail(10L)).thenReturn(expected);

        AdminUserDetail actual = adminUserManagementService.updateUserStatus(command);

        assertEquals(UserStatus.BANNED, user.getStatus());
        assertEquals(expected, actual);
        verify(userRepositoryPort).save(user);
    }

    @Test
    void updateUserStatusActivatesBannedLearner() {
        UpdateUserStatusCommand command = new UpdateUserStatusCommand(1L, 10L, UpdateUserStatusAction.ACTIVATE);
        User user = learnerUser(UserStatus.BANNED);
        AdminUserDetail expected = detailOf(user, UserStatus.ACTIVE);

        when(userReadPort.findById(10L)).thenReturn(Optional.of(user));
        when(getAdminUserDetailUseCase.getAdminUserDetail(10L)).thenReturn(expected);

        AdminUserDetail actual = adminUserManagementService.updateUserStatus(command);

        assertEquals(UserStatus.ACTIVE, user.getStatus());
        assertEquals(expected, actual);
        verify(userRepositoryPort).save(user);
    }

    @Test
    void updateUserStatusThrowsWhenTargetIsAdmin() {
        UpdateUserStatusCommand command = new UpdateUserStatusCommand(1L, 10L, UpdateUserStatusAction.BAN);
        User adminUser = User.restore(new UserRestoreData(10L, "Admin User", "admin@example.com", "hashed", null,
                UserRole.ADMIN, UserType.STUDENT, UserStatus.ACTIVE, LocalDateTime.parse("2026-06-01T10:00:00"),
                LocalDateTime.parse("2026-06-01T10:00:00")));

        when(userReadPort.findById(10L)).thenReturn(Optional.of(adminUser));

        InvalidDataException exception = assertThrows(InvalidDataException.class,
                () -> adminUserManagementService.updateUserStatus(command));

        assertEquals("Cannot change status of an admin account", exception.getMessage());
        verify(userRepositoryPort, never()).save(adminUser);
    }

    @Test
    void updateUserStatusThrowsWhenUserDoesNotExist() {
        UpdateUserStatusCommand command = new UpdateUserStatusCommand(1L, 10L, UpdateUserStatusAction.BAN);

        when(userReadPort.findById(10L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> adminUserManagementService.updateUserStatus(command));

        assertEquals("User not found", exception.getMessage());
    }

    private User learnerUser(UserStatus status) {
        return User.restore(new UserRestoreData(10L, "Nguyen Van A", "learner@example.com", "hashed", "0900000000",
                UserRole.LEARNER, UserType.STUDENT, status, LocalDateTime.parse("2026-06-01T10:00:00"),
                LocalDateTime.parse("2026-06-01T10:00:00")));
    }

    private AdminUserDetail detailOf(User user, UserStatus status) {
        return new AdminUserDetail(user.getId(), user.getFullName(), user.getEmail(), user.getPhone(),
                user.getRole(), user.getUserType(), status, user.getCreatedAt(), 0L, BigDecimal.ZERO);
    }
}
