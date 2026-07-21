package com.mentormatching.modules.stats.application.port.in;

import java.util.List;

import com.mentormatching.modules.stats.application.dto.AdminStatsDailyPoint;
import com.mentormatching.modules.stats.application.dto.GetAdminStatsQuery;

public interface GetAdminStatsTimeseriesUseCase {

    List<AdminStatsDailyPoint> getTimeseries(GetAdminStatsQuery query);
}
