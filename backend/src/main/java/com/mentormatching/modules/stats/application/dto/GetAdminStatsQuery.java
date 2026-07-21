package com.mentormatching.modules.stats.application.dto;

import java.time.LocalDate;

public record GetAdminStatsQuery(LocalDate from, LocalDate to) {
}
