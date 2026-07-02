package com.mentormatching.modules.media.application.port.in;

import com.mentormatching.modules.media.application.dto.ConfirmMediaUploadCommand;
import com.mentormatching.modules.media.application.dto.MediaAssetDetails;

public interface ConfirmMediaUploadUseCase {

    MediaAssetDetails confirmUpload(ConfirmMediaUploadCommand command);
}
