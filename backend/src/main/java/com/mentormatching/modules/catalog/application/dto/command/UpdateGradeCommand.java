package com.mentormatching.modules.catalog.application.dto.command;

import com.mentormatching.modules.catalog.domain.GradeLevelGroup;

public record UpdateGradeCommand(
        Long id,
        String name,
        GradeLevelGroup levelGroup
) {
}
