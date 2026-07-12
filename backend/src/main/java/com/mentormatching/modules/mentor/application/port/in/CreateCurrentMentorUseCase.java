package com.mentormatching.modules.mentor.application.port.in;

import com.mentormatching.modules.mentor.application.dto.CurrentMentorDetails;
import com.mentormatching.modules.mentor.application.dto.UpdateCurrentMentorCommand;

public interface CreateCurrentMentorUseCase {

    CurrentMentorDetails createCurrentMentor(UpdateCurrentMentorCommand command);
}
