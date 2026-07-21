package com.mentormatching.modules.payment.infrastructure.persistence;

import java.util.Set;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import com.mentormatching.modules.payment.application.dto.GetMentorPaymentsQuery;
import com.mentormatching.modules.payment.application.dto.GetMyPaymentsQuery;
import com.mentormatching.modules.payment.application.port.out.PaymentRepositoryPort;
import com.mentormatching.modules.payment.domain.Payment;
import com.mentormatching.modules.payment.domain.PaymentStatus;
import com.mentormatching.modules.payment.infrastructure.persistence.entity.PaymentJpaEntity;
import com.mentormatching.modules.payment.infrastructure.persistence.mapper.PaymentPersistenceMapper;
import com.mentormatching.modules.payment.infrastructure.persistence.repository.PaymentJpaRepository;
import com.mentormatching.shared.pagination.PageableUtils;
import com.mentormatching.shared.response.PageResponse;

@Component
public class PaymentPersistenceAdapter implements PaymentRepositoryPort {

    private static final Set<String> SORTABLE_FIELDS = Set.of("id", "bookingId", "amount", "status", "paidAt",
            "expiresAt", "createdAt", "updatedAt");

    private final PaymentJpaRepository paymentJpaRepository;
    private final PaymentPersistenceMapper paymentPersistenceMapper;

    public PaymentPersistenceAdapter(PaymentJpaRepository paymentJpaRepository,
                                     PaymentPersistenceMapper paymentPersistenceMapper) {
        this.paymentJpaRepository = paymentJpaRepository;
        this.paymentPersistenceMapper = paymentPersistenceMapper;
    }

    @Override
    public Payment save(Payment payment) {
        return paymentPersistenceMapper.toDomain(paymentJpaRepository.save(paymentPersistenceMapper.toEntity(payment)));
    }

    @Override
    public Optional<Payment> findById(Long id) {
        return paymentJpaRepository.findById(id).map(paymentPersistenceMapper::toDomain);
    }

    @Override
    public Optional<Payment> findByBookingId(Long bookingId) {
        return paymentJpaRepository.findByBookingId(bookingId).map(paymentPersistenceMapper::toDomain);
    }

    @Override
    public Optional<Payment> findByProviderReferenceId(String providerReferenceId) {
        return paymentJpaRepository.findByProviderReferenceId(providerReferenceId)
                .map(paymentPersistenceMapper::toDomain);
    }

    /**
     * Lấy các Payment của một user
     */
    @Override
    public PageResponse<Payment> findMyPayments(GetMyPaymentsQuery query) {
        Pageable pageable = PageableUtils.buildPageable(query.page(), query.size(), query.sortBy(), query.sortDir(),
                SORTABLE_FIELDS);
        Page<PaymentJpaEntity> paymentPage = query.status() == null
                ? paymentJpaRepository.findByPayerUserId(query.payerUserId(), pageable)
                : paymentJpaRepository.findByPayerUserIdAndStatus(query.payerUserId(), query.status(), pageable);
        return PageableUtils.toPageResponse(paymentPage, paymentPersistenceMapper::toDomain);
    }

    /**
     * Lấy các Payment của một mentor
     */
    @Override
    public PageResponse<Payment> findMentorPayments(Long mentorId, GetMentorPaymentsQuery query) {
        Pageable pageable = PageableUtils.buildPageable(query.page(), query.size(), query.sortBy(), query.sortDir(),
                SORTABLE_FIELDS);
        Page<PaymentJpaEntity> paymentPage = paymentJpaRepository.findMentorPayments(mentorId, query.status(),
                pageable);
        return PageableUtils.toPageResponse(paymentPage, paymentPersistenceMapper::toDomain);
    }

    @Override
    public List<Payment> findByPayerUserId(Long payerUserId) {
        return paymentJpaRepository.findByPayerUserId(payerUserId).stream().map(paymentPersistenceMapper::toDomain).toList();
    }

    @Override
    public List<Payment> findByStatus(PaymentStatus status) {
        return paymentJpaRepository.findByStatus(status).stream().map(paymentPersistenceMapper::toDomain).toList();
    }
}
