package com.mentormatching.modules.mentor.application.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.mentormatching.modules.mentor.application.dto.AdminMentorDetail;
import com.mentormatching.modules.mentor.application.dto.AdminMentorListItem;
import com.mentormatching.modules.mentor.application.dto.GetAdminMentorsQuery;
import com.mentormatching.modules.mentor.application.port.out.MentorCatalogLookupPort;
import com.mentormatching.modules.mentor.application.port.out.MentorReadRepositoryPort;
import com.mentormatching.modules.mentor.domain.Gender;
import com.mentormatching.modules.mentor.domain.MeetingType;
import com.mentormatching.modules.mentor.domain.MentorApprovalStatus;
import com.mentormatching.shared.exception.ResourceNotFoundException;
import com.mentormatching.shared.response.PageResponse;

class AdminMentorQueryServiceTest {

    private MentorReadRepositoryPort mentorReadRepositoryPort;
    private MentorCatalogLookupPort mentorCatalogLookupPort;
    private AdminMentorQueryService adminMentorQueryService;

    @BeforeEach
    void setUp() {
        mentorReadRepositoryPort = mock(MentorReadRepositoryPort.class);
        mentorCatalogLookupPort = mock(MentorCatalogLookupPort.class);
        adminMentorQueryService = new AdminMentorQueryService(mentorReadRepositoryPort, mentorCatalogLookupPort);
    }

    @Test
    void getAdminMentorsReturnsReadRepositoryResult() {
        GetAdminMentorsQuery query = new GetAdminMentorsQuery(1, 10, "createdAt", "desc", "anh",
                Gender.FEMALE, MeetingType.HYBRID, 1L, 2L, null, null, MentorApprovalStatus.PENDING);
        PageResponse<AdminMentorListItem> expected = PageResponse.<AdminMentorListItem>builder()
                .page(1)
                .pageSize(10)
                .totalPages(1)
                .totalItems(1)
                .data(List.of(new AdminMentorListItem(10L, 20L, "Nguyen Minh Anh",
                        "https://example.com/avatar.jpg", Gender.FEMALE, "Headline", 6, "Teacher",
                        "Mentor Matching", "HCMUS", "Mathematics", MeetingType.HYBRID,
                        MentorApprovalStatus.PENDING, null, null, LocalDateTime.parse("2026-06-01T10:15:30"))))
                .build();

        when(mentorReadRepositoryPort.findAdminMentors(query, null)).thenReturn(expected);

        PageResponse<AdminMentorListItem> actual = adminMentorQueryService.getAdminMentors(query);

        assertSame(expected, actual);
    }

    @Test
    void getAdminMentorsReturnsEmptyPageWhenSubjectGradeLookupIsEmpty() {
        GetAdminMentorsQuery query = new GetAdminMentorsQuery(2, 5, "createdAt", "desc", null,
                null, null, null, null, 100L, null, null);
        when(mentorCatalogLookupPort.getSubjectGradeIds(100L, null)).thenReturn(List.of());

        PageResponse<AdminMentorListItem> actual = adminMentorQueryService.getAdminMentors(query);

        assertEquals(2, actual.getPage());
        assertEquals(5, actual.getPageSize());
        assertEquals(0, actual.getTotalPages());
        assertEquals(0, actual.getTotalItems());
        assertEquals(List.of(), actual.getData());
    }

    @Test
    void getAdminMentorDetailReturnsReadRepositoryResult() {
        AdminMentorDetail expected = new AdminMentorDetail(10L, 20L, "Nguyen Minh Anh", "mentor@example.com",
                "0900000002", "https://example.com/avatar.jpg", Gender.FEMALE, 1L, "Ha Noi", 2L,
                "Ho Chi Minh City", 3L, "District 1", "Headline", "Intro", "Style", 6, "Teacher",
                "Mentor Matching", "HCMUS", "Mathematics", MeetingType.HYBRID, MentorApprovalStatus.PENDING,
                "Waiting for review", LocalDateTime.parse("2026-06-01T10:15:30"),
                LocalDateTime.parse("2026-06-05T12:00:00"));
        when(mentorReadRepositoryPort.findAdminMentorDetailById(10L)).thenReturn(Optional.of(expected));

        AdminMentorDetail actual = adminMentorQueryService.getAdminMentorDetail(10L);

        assertSame(expected, actual);
    }

    @Test
    void getAdminMentorDetailThrowsWhenMentorDoesNotExist() {
        when(mentorReadRepositoryPort.findAdminMentorDetailById(99L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> adminMentorQueryService.getAdminMentorDetail(99L));

        assertEquals("Mentor profile not found", exception.getMessage());
    }
}
