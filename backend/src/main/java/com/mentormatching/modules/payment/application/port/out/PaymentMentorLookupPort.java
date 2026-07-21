package com.mentormatching.modules.payment.application.port.out;

import com.mentormatching.modules.payment.application.dto.PaymentMentorSnapshot;

public interface PaymentMentorLookupPort {

    PaymentMentorSnapshot getMentorSnapshotByUserId(Long userId);
}
