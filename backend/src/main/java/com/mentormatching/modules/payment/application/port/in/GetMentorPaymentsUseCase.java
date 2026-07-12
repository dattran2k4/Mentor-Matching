package com.mentormatching.modules.payment.application.port.in;

import com.mentormatching.modules.payment.application.dto.GetMentorPaymentsQuery;
import com.mentormatching.modules.payment.domain.Payment;
import com.mentormatching.shared.response.PageResponse;

public interface GetMentorPaymentsUseCase {

    PageResponse<Payment> getMentorPayments(GetMentorPaymentsQuery query);
}
