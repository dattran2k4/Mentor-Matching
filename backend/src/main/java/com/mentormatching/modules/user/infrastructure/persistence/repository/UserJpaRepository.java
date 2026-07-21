package com.mentormatching.modules.user.infrastructure.persistence.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mentormatching.modules.user.domain.UserRole;
import com.mentormatching.modules.user.domain.UserStatus;
import com.mentormatching.modules.user.infrastructure.persistence.entity.UserJpaEntity;

@Repository
public interface UserJpaRepository extends JpaRepository<UserJpaEntity, Long> {

    Optional<UserJpaEntity> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    boolean existsByPhoneAndIdNot(String phone, Long id);

    @Query("""
            select u from UserJpaEntity u
            where (:role is null or u.role = :role)
              and (:status is null or u.status = :status)
              and (:search is null
                   or lower(u.fullName) like :search
                   or lower(u.email) like :search)
            """)
    Page<UserJpaEntity> findAdminUsers(@Param("role") UserRole role, @Param("status") UserStatus status,
            @Param("search") String search, Pageable pageable);
}
