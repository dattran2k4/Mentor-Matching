package com.mentormatching.modules.user.application.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mentormatching.modules.booking.application.port.out.BookingRepositoryPort;
import com.mentormatching.modules.payment.application.port.out.PaymentRepositoryPort;
import com.mentormatching.modules.payment.domain.PaymentStatus;
import com.mentormatching.modules.user.application.dto.AdminUserDetail;
import com.mentormatching.modules.user.application.dto.AdminUserListItem;
import com.mentormatching.modules.user.application.dto.GetAdminUsersQuery;
import com.mentormatching.modules.user.application.port.in.GetAdminUserDetailUseCase;
import com.mentormatching.modules.user.application.port.in.GetAdminUsersUseCase;
import com.mentormatching.modules.user.application.port.out.UserReadPort;
import com.mentormatching.modules.user.domain.User;
import com.mentormatching.shared.exception.ResourceNotFoundException;
import com.mentormatching.shared.response.PageResponse;

@Service
@Transactional(readOnly = true)
public class AdminUserQueryService implements GetAdminUsersUseCase, GetAdminUserDetailUseCase {

    private final UserReadPort userReadPort;
    private final BookingRepositoryPort bookingRepositoryPort;
    private final PaymentRepositoryPort paymentRepositoryPort;

    public AdminUserQueryService(UserReadPort userReadPort, BookingRepositoryPort bookingRepositoryPort,
                                 PaymentRepositoryPort paymentRepositoryPort) {
        this.userReadPort = userReadPort;
        this.bookingRepositoryPort = bookingRepositoryPort;
        this.paymentRepositoryPort = paymentRepositoryPort;
    }

    @Override
    public PageResponse<AdminUserListItem> getAdminUsers(GetAdminUsersQuery query) {
        return userReadPort.findAdminUsers(query);
    }

    @Override
    public AdminUserDetail getAdminUserDetail(Long userId) {
        User user = userReadPort.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        long totalBookings = bookingRepositoryPort.findByStudentUserId(userId).size();
        BigDecimal totalSpent = paymentRepositoryPort.findByPayerUserId(userId).stream()
                .filter(payment -> payment.getStatus() == PaymentStatus.PAID)
                .map(payment -> payment.getAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new AdminUserDetail(user.getId(), user.getFullName(), user.getEmail(), user.getPhone(),
                user.getRole(), user.getUserType(), user.getStatus(), user.getCreatedAt(), totalBookings,
                totalSpent);
    }
}
