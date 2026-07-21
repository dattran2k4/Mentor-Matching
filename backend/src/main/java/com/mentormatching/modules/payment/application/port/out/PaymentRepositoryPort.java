package com.mentormatching.modules.payment.application.port.out;

import java.util.List;
import java.util.Optional;

import com.mentormatching.modules.payment.application.dto.GetMentorPaymentsQuery;
import com.mentormatching.modules.payment.application.dto.GetMyPaymentsQuery;
import com.mentormatching.modules.payment.domain.Payment;
import com.mentormatching.modules.payment.domain.PaymentStatus;
import com.mentormatching.shared.response.PageResponse;

public interface PaymentRepositoryPort {

    Payment save(Payment payment);

    Optional<Payment> findById(Long id);

    Optional<Payment> findByBookingId(Long bookingId);

    Optional<Payment> findByProviderReferenceId(String providerReferenceId);

    PageResponse<Payment> findMyPayments(GetMyPaymentsQuery query);

    PageResponse<Payment> findMentorPayments(Long mentorId, GetMentorPaymentsQuery query);

    List<Payment> findByPayerUserId(Long payerUserId);

    List<Payment> findByStatus(PaymentStatus status);
}
