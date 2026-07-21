package com.mentormatching.modules.catalog.application.dto.command;

import com.mentormatching.modules.catalog.domain.GradeLevelGroup;

public record CreateGradeCommand(
        String name,
        GradeLevelGroup levelGroup
) {
}
