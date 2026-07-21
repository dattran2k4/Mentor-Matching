package com.mentormatching.modules.catalog.application.port.in;

import com.mentormatching.modules.catalog.application.dto.command.CreateGradeCommand;
import com.mentormatching.modules.catalog.application.dto.command.UpdateGradeCommand;
import com.mentormatching.modules.catalog.domain.Grade;

public interface ManageGradeUseCase {
    Grade createGrade(CreateGradeCommand command);
    Grade updateGrade(UpdateGradeCommand command);
    void deleteGrade(Long id);
}
