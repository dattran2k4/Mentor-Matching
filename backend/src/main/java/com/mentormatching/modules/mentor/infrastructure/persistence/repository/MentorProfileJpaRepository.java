package com.mentormatching.modules.mentor.infrastructure.persistence.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mentormatching.modules.mentor.domain.Gender;
import com.mentormatching.modules.mentor.domain.MeetingType;
import com.mentormatching.modules.mentor.domain.MentorApprovalStatus;
import com.mentormatching.modules.mentor.infrastructure.persistence.entity.MentorProfileJpaEntity;

public interface MentorProfileJpaRepository extends JpaRepository<MentorProfileJpaEntity, Long> {

    Optional<MentorProfileJpaEntity> findByUserId(Long userId);

    boolean existsByUserId(Long userId);

    boolean existsByIdAndApprovalStatus(Long id, MentorApprovalStatus approvalStatus);

    @Query("""
            select mentor.id as id,
                   mentor.userId as userId,
                   user.fullName as fullName,
                   mentor.avatarUrl as avatarUrl,
                   mentor.avatarMediaId as avatarMediaId,
                   mentor.gender as gender,
                   mentor.headline as headline,
                   mentor.experienceYears as experienceYears,
                   mentor.currentPosition as currentPosition,
                   mentor.workplace as workplace,
                   mentor.education as education,
                   mentor.major as major,
                   mentor.meetingType as meetingType,
                   mentor.approvalStatus as approvalStatus,
                   mentor.createdAt as createdAt,
                   (select min(ms.pricePerHour) from MentorSubjectJpaEntity ms where ms.mentorId = mentor.id and ms.active = true) as minPrice
            from MentorProfileJpaEntity mentor
            join UserJpaEntity user on user.id = mentor.userId
            left join DistrictJpaEntity district on district.id = mentor.currentDistrictId
            where (:approvalStatus is null or mentor.approvalStatus = :approvalStatus)
              and (:gender is null or mentor.gender = :gender)
              and (:meetingType is null or mentor.meetingType = :meetingType)
              and (:cityId is null or district.cityId = :cityId)
              and (:districtId is null or mentor.currentDistrictId = :districtId)
              and (:subjectGradeIds is null or mentor.id IN (
                   select ms.mentorId
                   from MentorSubjectJpaEntity ms
                   where ms.subjectGradeId IN :subjectGradeIds
                     and ms.active = true
              ))
              and (:search is null
                   or lower(user.fullName) like :search
                   or lower(mentor.headline) like :search
                   or lower(mentor.introduction) like :search
                   or lower(mentor.currentPosition) like :search
                   or lower(mentor.workplace) like :search
                   or lower(mentor.education) like :search
                   or lower(mentor.major) like :search)
            """)
    Page<AdminMentorListItemProjection> findAdminMentors(@Param("approvalStatus") MentorApprovalStatus approvalStatus,
                                                         @Param("search") String search,
                                                         @Param("gender") Gender gender,
                                                         @Param("meetingType") MeetingType meetingType,
                                                         @Param("cityId") Long cityId,
                                                         @Param("districtId") Long districtId,
                                                         @Param("subjectGradeIds") List<Long> subjectGradeIds,
                                                         Pageable pageable);

    @Query("""
            select mentor.id as id,
                   mentor.userId as userId,
                   user.fullName as fullName,
                   mentor.avatarUrl as avatarUrl,
                   mentor.gender as gender,
                   mentor.headline as headline,
                   mentor.experienceYears as experienceYears,
                   mentor.currentPosition as currentPosition,
                   mentor.workplace as workplace,
                   mentor.education as education,
                   mentor.major as major,
                   mentor.meetingType as meetingType,
                   mentor.createdAt as createdAt,
                   (select min(ms.pricePerHour) from MentorSubjectJpaEntity ms where ms.mentorId = mentor.id and ms.active = true) as minPrice
            from MentorProfileJpaEntity mentor
            join UserJpaEntity user on user.id = mentor.userId
            left join DistrictJpaEntity district on district.id = mentor.currentDistrictId
            where mentor.approvalStatus = :approvalStatus
              and (:gender is null or mentor.gender = :gender)
              and (:meetingType is null or mentor.meetingType = :meetingType)
              and (:cityId is null or district.cityId = :cityId)
              and (:districtId is null or mentor.currentDistrictId = :districtId)
              and (:subjectGradeIds is null or mentor.id IN (
                   select ms.mentorId
                   from MentorSubjectJpaEntity ms
                   where ms.subjectGradeId IN :subjectGradeIds
                     and ms.active = true
              ))
              and (:search is null
                   or lower(user.fullName) like :search
                   or lower(mentor.headline) like :search
                   or lower(mentor.introduction) like :search
                   or lower(mentor.currentPosition) like :search
                   or lower(mentor.workplace) like :search
                   or lower(mentor.education) like :search
                   or lower(mentor.major) like :search)
            """)
    Page<MentorListItemProjection> findApprovedMentors(@Param("approvalStatus") MentorApprovalStatus approvalStatus,
                                                       @Param("search") String search,
                                                       @Param("gender") Gender gender,
                                                       @Param("meetingType") MeetingType meetingType,
                                                       @Param("cityId") Long cityId,
                                                       @Param("districtId") Long districtId,
                                                       @Param("subjectGradeIds") List<Long> subjectGradeIds,
                                                       Pageable pageable);

    @Query("""
            select mentor.id as id,
                   mentor.userId as userId,
                   user.fullName as fullName,
                   mentor.avatarUrl as avatarUrl,
                   mentor.gender as gender,
                   mentor.hometownCityId as hometownCityId,
                   hometownCity.name as hometownCityName,
                   currentCity.id as currentCityId,
                   currentCity.name as currentCityName,
                   mentor.currentDistrictId as currentDistrictId,
                   currentDistrict.name as currentDistrictName,
                   mentor.headline as headline,
                   mentor.introduction as introduction,
                   mentor.teachingStyle as teachingStyle,
                   mentor.experienceYears as experienceYears,
                   mentor.currentPosition as currentPosition,
                   mentor.workplace as workplace,
                   mentor.education as education,
                   mentor.major as major,
                   mentor.meetingType as meetingType,
                   mentor.approvalStatus as approvalStatus,
                   mentor.approvalNote as approvalNote,
                   verification.verificationStatus as verificationStatus,
                   verification.rejectionReason as verificationRejectionReason,
                   mentor.createdAt as createdAt,
                   mentor.updatedAt as updatedAt
            from MentorProfileJpaEntity mentor
            join UserJpaEntity user on user.id = mentor.userId
            left join CityJpaEntity hometownCity on hometownCity.id = mentor.hometownCityId
            left join DistrictJpaEntity currentDistrict on currentDistrict.id = mentor.currentDistrictId
            left join CityJpaEntity currentCity on currentCity.id = currentDistrict.cityId
            left join MentorVerificationJpaEntity verification on verification.mentorId = mentor.id
            where mentor.id = :mentorId
            """)
    Optional<CurrentMentorDetailsProjection> findCurrentMentorDetailByMentorId(@Param("mentorId") Long mentorId);

    @Query("""
            select mentor.id as id,
                   mentor.userId as userId,
                   user.fullName as fullName,
                   mentor.avatarUrl as avatarUrl,
                   mentor.gender as gender,
                   mentor.hometownCityId as hometownCityId,
                   hometownCity.name as hometownCityName,
                   currentCity.id as currentCityId,
                   currentCity.name as currentCityName,
                   mentor.currentDistrictId as currentDistrictId,
                   currentDistrict.name as currentDistrictName,
                   mentor.headline as headline,
                   mentor.introduction as introduction,
                   mentor.teachingStyle as teachingStyle,
                   mentor.experienceYears as experienceYears,
                   mentor.currentPosition as currentPosition,
                   mentor.workplace as workplace,
                   mentor.education as education,
                   mentor.major as major,
                   mentor.meetingType as meetingType,
                   mentor.createdAt as createdAt,
                   mentor.updatedAt as updatedAt
            from MentorProfileJpaEntity mentor
            join UserJpaEntity user on user.id = mentor.userId
            left join CityJpaEntity hometownCity on hometownCity.id = mentor.hometownCityId
            left join DistrictJpaEntity currentDistrict on currentDistrict.id = mentor.currentDistrictId
            left join CityJpaEntity currentCity on currentCity.id = currentDistrict.cityId
            where mentor.id = :mentorId
              and mentor.approvalStatus = :approvalStatus
            """)
    Optional<MentorDetailProjection> findApprovedMentorDetail(@Param("mentorId") Long mentorId,
                                                             @Param("approvalStatus") MentorApprovalStatus approvalStatus);

    @Query("""
            select mentor.id as id,
                   mentor.userId as userId,
                   user.fullName as fullName,
                   user.email as email,
                   user.phone as phone,
                   mentor.avatarUrl as avatarUrl,
                   mentor.gender as gender,
                   mentor.hometownCityId as hometownCityId,
                   hometownCity.name as hometownCityName,
                   currentCity.id as currentCityId,
                   currentCity.name as currentCityName,
                   mentor.currentDistrictId as currentDistrictId,
                   currentDistrict.name as currentDistrictName,
                   mentor.headline as headline,
                   mentor.introduction as introduction,
                   mentor.teachingStyle as teachingStyle,
                   mentor.experienceYears as experienceYears,
                   mentor.currentPosition as currentPosition,
                   mentor.workplace as workplace,
                   mentor.education as education,
                   mentor.major as major,
                   mentor.meetingType as meetingType,
                   mentor.approvalStatus as approvalStatus,
                   mentor.approvalNote as approvalNote,
                   mentor.createdAt as createdAt,
                   mentor.updatedAt as updatedAt
            from MentorProfileJpaEntity mentor
            join UserJpaEntity user on user.id = mentor.userId
            left join CityJpaEntity hometownCity on hometownCity.id = mentor.hometownCityId
            left join DistrictJpaEntity currentDistrict on currentDistrict.id = mentor.currentDistrictId
            left join CityJpaEntity currentCity on currentCity.id = currentDistrict.cityId
            where mentor.id = :mentorId
            """)
    Optional<AdminMentorDetailProjection> findAdminMentorDetail(@Param("mentorId") Long mentorId);
}
