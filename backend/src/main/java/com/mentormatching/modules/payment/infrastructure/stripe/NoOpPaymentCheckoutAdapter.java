package com.mentormatching.modules.payment.infrastructure.stripe;

import java.time.LocalDateTime;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.mentormatching.modules.payment.application.dto.CheckoutSessionResult;
import com.mentormatching.modules.payment.application.port.out.PaymentCheckoutPort;
import com.mentormatching.modules.payment.domain.Payment;

@Component
@Profile("test")
public class NoOpPaymentCheckoutAdapter implements PaymentCheckoutPort {

    @Override
    public CheckoutSessionResult createCheckoutSession(Payment payment) {
        return new CheckoutSessionResult("test_checkout_session_" + payment.getId(),
                "http://localhost/test-checkout/" + payment.getId(), LocalDateTime.now().plusMinutes(30));
    }

    @Override
    public void refundPayment(Payment payment) {
        // no-op: Stripe refunds are not exercised in the test profile
    }
}
