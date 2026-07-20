package com.mentormatching.modules.stats.application.port.in;

import com.mentormatching.modules.stats.application.dto.AdminStatsOverview;
import com.mentormatching.modules.stats.application.dto.GetAdminStatsQuery;

public interface GetAdminStatsOverviewUseCase {

    AdminStatsOverview getOverview(GetAdminStatsQuery query);
}
