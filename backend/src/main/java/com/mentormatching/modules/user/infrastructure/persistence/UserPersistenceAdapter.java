package com.mentormatching.modules.user.infrastructure.persistence;

import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import com.mentormatching.modules.user.application.dto.AdminUserListItem;
import com.mentormatching.modules.user.application.dto.GetAdminUsersQuery;
import com.mentormatching.modules.user.application.port.out.UserReadPort;
import com.mentormatching.modules.user.application.port.out.UserRepositoryPort;
import com.mentormatching.modules.user.domain.User;
import com.mentormatching.modules.user.infrastructure.persistence.entity.UserJpaEntity;
import com.mentormatching.modules.user.infrastructure.persistence.mapper.UserPersistenceMapper;
import com.mentormatching.modules.user.infrastructure.persistence.repository.UserJpaRepository;
import com.mentormatching.shared.pagination.PageableUtils;
import com.mentormatching.shared.response.PageResponse;

@Component
@RequiredArgsConstructor
public class UserPersistenceAdapter implements UserRepositoryPort, UserReadPort {

    private static final Set<String> ADMIN_USER_SORTABLE_FIELDS = Set.of("id", "fullName", "email", "role",
            "userType", "status", "createdAt");

    private final UserJpaRepository userJpaRepository;
    private final UserPersistenceMapper userPersistenceMapper;

    @Override
    public User save(User user) {
        return userPersistenceMapper.toDomain(userJpaRepository.save(userPersistenceMapper.toEntity(user)));
    }

    @Override
    public Optional<User> findById(Long id) {
        return userJpaRepository.findById(id).map(userPersistenceMapper::toDomain);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userJpaRepository.findByEmail(email).map(userPersistenceMapper::toDomain);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userJpaRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByPhone(String phone) {
        return userJpaRepository.existsByPhone(phone);
    }

    @Override
    public boolean existsByPhoneAndIdNot(String phone, Long id) {
        return userJpaRepository.existsByPhoneAndIdNot(phone, id);
    }

    @Override
    public PageResponse<AdminUserListItem> findAdminUsers(GetAdminUsersQuery query) {
        Pageable pageable = PageableUtils.buildPageable(query.page(), query.size(), query.sortBy(), query.sortDir(),
                ADMIN_USER_SORTABLE_FIELDS);
        Page<UserJpaEntity> userPage = userJpaRepository.findAdminUsers(query.role(), query.status(),
                containsPattern(query.search()), pageable);
        return PageableUtils.toPageResponse(userPage, this::toAdminListItem);
    }

    private AdminUserListItem toAdminListItem(UserJpaEntity entity) {
        return new AdminUserListItem(entity.getId(), entity.getFullName(), entity.getEmail(), entity.getPhone(),
                entity.getRole(), entity.getUserType(), entity.getStatus(), entity.getCreatedAt());
    }

    private String containsPattern(String value) {
        return StringUtils.hasText(value) ? "%" + value.trim().toLowerCase() + "%" : null;
    }
}
