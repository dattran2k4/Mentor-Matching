package com.mentormatching.modules.payment.presentation;

import static com.mentormatching.shared.response.PageQueryDefaults.DEFAULT_PAGE;
import static com.mentormatching.shared.response.PageQueryDefaults.DEFAULT_SIZE;
import static com.mentormatching.shared.response.PageQueryDefaults.DEFAULT_SORT_BY;
import static com.mentormatching.shared.response.PageQueryDefaults.DEFAULT_SORT_DIR;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mentormatching.modules.payment.application.dto.GetMentorPaymentsQuery;
import com.mentormatching.modules.payment.application.dto.GetMyPaymentsQuery;
import com.mentormatching.modules.payment.application.dto.PaymentDetail;
import com.mentormatching.modules.payment.application.dto.PaymentResult;
import com.mentormatching.modules.payment.application.port.in.CreatePaymentUseCase;
import com.mentormatching.modules.payment.application.port.in.GetPaymentDetailUseCase;
import com.mentormatching.modules.payment.application.port.in.GetMentorPaymentsUseCase;
import com.mentormatching.modules.payment.application.port.in.GetMyPaymentsUseCase;
import com.mentormatching.modules.payment.domain.Payment;
import com.mentormatching.modules.payment.domain.PaymentStatus;
import com.mentormatching.modules.payment.presentation.dto.request.CreatePaymentRequest;
import com.mentormatching.modules.payment.presentation.dto.response.CreatePaymentResponse;
import com.mentormatching.modules.payment.presentation.dto.response.PaymentDetailResponse;
import com.mentormatching.modules.payment.presentation.dto.response.PaymentResponse;
import com.mentormatching.shared.response.ApiResponse;
import com.mentormatching.shared.response.ApiResponseFactory;
import com.mentormatching.shared.response.PageResponse;
import com.mentormatching.shared.security.model.AuthenticatedPrincipal;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping("/api/v1/payments")
@Slf4j(topic = "PAYMENT-CONTROLLER")
public class PaymentController {

    private final CreatePaymentUseCase createPaymentUseCase;
    private final GetPaymentDetailUseCase getPaymentDetailUseCase;
    private final GetMyPaymentsUseCase getMyPaymentsUseCase;
    private final GetMentorPaymentsUseCase getMentorPaymentsUseCase;
    private final ApiResponseFactory apiResponseFactory;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<CreatePaymentResponse> createPayment(@AuthenticationPrincipal AuthenticatedPrincipal principal,
                                                            @Valid @RequestBody CreatePaymentRequest request) {
        log.info("Received request to create payment for userId {}", principal.getId());
        PaymentResult payment = createPaymentUseCase.createPayment(request.toCommand(principal));
        return apiResponseFactory.created(CreatePaymentResponse.from(payment), "Create payment successfully");
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<PageResponse<PaymentResponse>> getMyPayments(
            @AuthenticationPrincipal AuthenticatedPrincipal principal,
            @RequestParam(defaultValue = DEFAULT_PAGE) @Min(1) int page,
            @RequestParam(defaultValue = DEFAULT_SIZE) @Min(1) @Max(100) int size,
            @RequestParam(defaultValue = DEFAULT_SORT_BY) String sortBy,
            @RequestParam(defaultValue = DEFAULT_SORT_DIR) String sortDir,
            @RequestParam(required = false) PaymentStatus status) {
        PageResponse<Payment> payments = getMyPaymentsUseCase.getMyPayments(new GetMyPaymentsQuery(principal.getId(), page, size, sortBy, sortDir, status));
        return apiResponseFactory.success(PaymentResponse.from(payments), "Get my payments successfully");
    }

    @GetMapping("/mentor/me")
    @PreAuthorize("hasRole('MENTOR')")
    public ApiResponse<PageResponse<PaymentResponse>> getMentorPayments(
            @AuthenticationPrincipal AuthenticatedPrincipal principal,
            @RequestParam(defaultValue = DEFAULT_PAGE) @Min(1) int page,
            @RequestParam(defaultValue = DEFAULT_SIZE) @Min(1) @Max(100) int size,
            @RequestParam(defaultValue = DEFAULT_SORT_BY) String sortBy,
            @RequestParam(defaultValue = DEFAULT_SORT_DIR) String sortDir,
            @RequestParam(required = false) PaymentStatus status) {
        PageResponse<Payment> payments = getMentorPaymentsUseCase.getMentorPayments(new GetMentorPaymentsQuery(principal.getId(), page, size, sortBy, sortDir, status));
        return apiResponseFactory.success(PaymentResponse.from(payments), "Get mentor payments successfully");
    }

    @GetMapping("/{paymentId}")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<PaymentDetailResponse> getPaymentDetail(
            @AuthenticationPrincipal AuthenticatedPrincipal principal,
            @PathVariable Long paymentId) {
        PaymentDetail payment = getPaymentDetailUseCase.getPaymentDetail(principal.getId(), paymentId);
        return apiResponseFactory.success(PaymentDetailResponse.from(payment), "Get payment detail successfully");
    }
}
