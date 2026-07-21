package com.mentormatching.modules.stats.presentation;

import java.time.LocalDate;
import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mentormatching.modules.stats.application.dto.AdminStatsDailyPoint;
import com.mentormatching.modules.stats.application.dto.AdminStatsOverview;
import com.mentormatching.modules.stats.application.dto.GetAdminStatsQuery;
import com.mentormatching.modules.stats.application.port.in.GetAdminStatsOverviewUseCase;
import com.mentormatching.modules.stats.application.port.in.GetAdminStatsTimeseriesUseCase;
import com.mentormatching.modules.stats.presentation.dto.response.AdminStatsDailyPointResponse;
import com.mentormatching.modules.stats.presentation.dto.response.AdminStatsOverviewResponse;
import com.mentormatching.shared.response.ApiResponse;
import com.mentormatching.shared.response.ApiResponseFactory;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/stats")
@PreAuthorize("hasRole('ADMIN')")
public class AdminStatsController {

    private final GetAdminStatsOverviewUseCase getAdminStatsOverviewUseCase;
    private final GetAdminStatsTimeseriesUseCase getAdminStatsTimeseriesUseCase;
    private final ApiResponseFactory apiResponseFactory;

    @GetMapping("/overview")
    public ApiResponse<AdminStatsOverviewResponse> getOverview(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        AdminStatsOverview overview = getAdminStatsOverviewUseCase.getOverview(new GetAdminStatsQuery(from, to));
        return apiResponseFactory.success(AdminStatsOverviewResponse.from(overview), "Get admin stats overview successfully");
    }

    @GetMapping("/timeseries")
    public ApiResponse<List<AdminStatsDailyPointResponse>> getTimeseries(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        List<AdminStatsDailyPoint> timeseries = getAdminStatsTimeseriesUseCase.getTimeseries(
                new GetAdminStatsQuery(from, to));
        return apiResponseFactory.success(AdminStatsDailyPointResponse.from(timeseries),
                "Get admin stats timeseries successfully");
    }
}
