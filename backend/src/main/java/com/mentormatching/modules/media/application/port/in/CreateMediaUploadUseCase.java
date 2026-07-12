package com.mentormatching.modules.media.application.port.in;

import com.mentormatching.modules.media.application.dto.CreateMediaUploadCommand;
import com.mentormatching.modules.media.application.dto.MediaUploadIntent;

public interface CreateMediaUploadUseCase {

    MediaUploadIntent createUpload(CreateMediaUploadCommand command);
}
