package com.mentormatching.modules.payment.infrastructure.lookup;

import org.springframework.stereotype.Component;

import com.mentormatching.modules.mentor.application.dto.MentorSummary;
import com.mentormatching.modules.mentor.application.port.in.GetMentorSummaryByUserUseCase;
import com.mentormatching.modules.payment.application.dto.PaymentMentorSnapshot;
import com.mentormatching.modules.payment.application.port.out.PaymentMentorLookupPort;

@Component
public class PaymentMentorLookupAdapter implements PaymentMentorLookupPort {

    private final GetMentorSummaryByUserUseCase getMentorSummaryByUserUseCase;

    public PaymentMentorLookupAdapter(GetMentorSummaryByUserUseCase getMentorSummaryByUserUseCase) {
        this.getMentorSummaryByUserUseCase = getMentorSummaryByUserUseCase;
    }

    @Override
    public PaymentMentorSnapshot getMentorSnapshotByUserId(Long userId) {
        MentorSummary mentor = getMentorSummaryByUserUseCase.getMentorSummaryByUserId(userId);
        return new PaymentMentorSnapshot(mentor.mentorId());
    }
}
