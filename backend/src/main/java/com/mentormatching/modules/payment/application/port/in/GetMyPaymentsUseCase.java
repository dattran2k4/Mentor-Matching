package com.mentormatching.modules.payment.application.port.in;

import com.mentormatching.modules.payment.application.dto.GetMyPaymentsQuery;
import com.mentormatching.modules.payment.domain.Payment;
import com.mentormatching.shared.response.PageResponse;

public interface GetMyPaymentsUseCase {

    PageResponse<Payment> getMyPayments(GetMyPaymentsQuery query);
}
