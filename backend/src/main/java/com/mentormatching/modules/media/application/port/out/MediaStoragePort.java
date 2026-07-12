package com.mentormatching.modules.media.application.port.out;

import com.mentormatching.modules.media.application.dto.ConfirmMediaUploadCommand;
import com.mentormatching.modules.media.application.dto.CreateMediaUploadCommand;
import com.mentormatching.modules.media.application.dto.MediaUploadIntent;
import com.mentormatching.modules.media.domain.MediaAsset;
import com.mentormatching.modules.media.domain.MediaProvider;

public interface MediaStoragePort {

    MediaProvider provider();

    String createObjectKey(CreateMediaUploadCommand command);

    MediaUploadIntent createUploadIntent(MediaAsset mediaAsset);

    void verifyUpload(MediaAsset mediaAsset, ConfirmMediaUploadCommand command);

    void delete(MediaAsset mediaAsset);
}
