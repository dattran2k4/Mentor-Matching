package com.mentormatching.modules.catalog.application.port.in;

import com.mentormatching.modules.catalog.application.dto.command.CreateSubjectCommand;
import com.mentormatching.modules.catalog.application.dto.command.UpdateSubjectCommand;
import com.mentormatching.modules.catalog.domain.Subject;

public interface ManageSubjectUseCase {
    
    Subject createSubject(CreateSubjectCommand command);
    
    Subject updateSubject(UpdateSubjectCommand command);
    
    void deleteSubject(Long id);
}
