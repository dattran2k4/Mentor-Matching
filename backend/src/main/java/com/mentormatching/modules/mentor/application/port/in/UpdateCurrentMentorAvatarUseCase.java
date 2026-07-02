package com.mentormatching.modules.mentor.application.port.in;

import com.mentormatching.modules.mentor.application.dto.CurrentMentorDetails;
import com.mentormatching.modules.mentor.application.dto.UpdateCurrentMentorAvatarCommand;

public interface UpdateCurrentMentorAvatarUseCase {

    CurrentMentorDetails updateCurrentMentorAvatar(UpdateCurrentMentorAvatarCommand command);
}
