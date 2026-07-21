package com.mentormatching.modules.payment.application.port.out;

import com.mentormatching.modules.payment.application.dto.CheckoutSessionResult;
import com.mentormatching.modules.payment.domain.Payment;

public interface PaymentCheckoutPort {

    CheckoutSessionResult createCheckoutSession(Payment payment);

    void refundPayment(Payment payment);
}
