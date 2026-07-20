package com.mentormatching.modules.payment.infrastructure.stripe;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Set;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.mentormatching.modules.payment.application.dto.CheckoutSessionResult;
import com.mentormatching.modules.payment.application.port.out.PaymentCheckoutPort;
import com.mentormatching.modules.payment.domain.Payment;
import com.mentormatching.shared.config.properties.AppStripeProperties;
import com.stripe.exception.StripeException;
import com.stripe.model.Refund;
import com.stripe.model.checkout.Session;
import com.stripe.net.RequestOptions;
import com.stripe.param.RefundCreateParams;
import com.stripe.param.checkout.SessionCreateParams;

@Component
@Profile("!test")
public class StripeCheckoutAdapter implements PaymentCheckoutPort {

    private static final Set<String> ZERO_DECIMAL_CURRENCIES = Set.of("bif", "clp", "djf", "gnf", "jpy", "kmf",
            "krw", "mga", "pyg", "rwf", "ugx", "vnd", "vuv", "xaf", "xof", "xpf");

    private final AppStripeProperties stripeProperties;

    public StripeCheckoutAdapter(AppStripeProperties stripeProperties) {
        this.stripeProperties = stripeProperties;
    }

    @Override
    public CheckoutSessionResult createCheckoutSession(Payment payment) {
        if (stripeProperties.secretKey().isBlank()) {
            throw new IllegalStateException("Stripe secret key is not configured");
        }

        try {
            Session session = Session.create(buildSessionParams(payment), buildRequestOptions());
            return new CheckoutSessionResult(session.getId(), session.getUrl(), toLocalDateTime(session.getExpiresAt()));
        } catch (StripeException ex) {
            throw new IllegalStateException("Failed to create Stripe checkout session", ex);
        }
    }

    @Override
    public void refundPayment(Payment payment) {
        if (stripeProperties.secretKey().isBlank()) {
            throw new IllegalStateException("Stripe secret key is not configured");
        }
        if (payment.getProviderTransactionId() == null || payment.getProviderTransactionId().isBlank()) {
            throw new IllegalStateException("Payment has no Stripe payment intent to refund");
        }

        try {
            RefundCreateParams params = RefundCreateParams.builder()
                    .setPaymentIntent(payment.getProviderTransactionId())
                    .build();
            Refund.create(params, buildRequestOptions());
        } catch (StripeException ex) {
            throw new IllegalStateException("Failed to refund Stripe payment", ex);
        }
    }

    private SessionCreateParams buildSessionParams(Payment payment) {
        return SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setClientReferenceId(String.valueOf(payment.getId()))
                .setSuccessUrl(appendQuery(stripeProperties.successUrl(), "session_id={CHECKOUT_SESSION_ID}",
                        "payment_id=" + payment.getId()))
                .setCancelUrl(appendQuery(stripeProperties.cancelUrl(), "payment_id=" + payment.getId()))
                .putMetadata("paymentId", String.valueOf(payment.getId()))
                .putMetadata("bookingId", String.valueOf(payment.getBookingId()))
                .setPaymentIntentData(buildPaymentIntentData(payment))
                .addLineItem(buildLineItem(payment))
                .build();
    }

    private SessionCreateParams.PaymentIntentData buildPaymentIntentData(Payment payment) {
        return SessionCreateParams.PaymentIntentData.builder()
                .putMetadata("paymentId", String.valueOf(payment.getId()))
                .putMetadata("bookingId", String.valueOf(payment.getBookingId()))
                .build();
    }

    private SessionCreateParams.LineItem buildLineItem(Payment payment) {
        return SessionCreateParams.LineItem.builder()
                .setQuantity(1L)
                .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                        .setCurrency(stripeProperties.currency())
                        .setUnitAmount(toStripeAmount(payment.getAmount()))
                        .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                .setName("Mentor Matching Booking #" + payment.getBookingId())
                                .build())
                        .build())
                .build();
    }

    private RequestOptions buildRequestOptions() {
        return RequestOptions.builder()
                .setApiKey(stripeProperties.secretKey())
                .build();
    }

    private Long toStripeAmount(BigDecimal amount) {
        if (ZERO_DECIMAL_CURRENCIES.contains(stripeProperties.currency())) {
            return amount.setScale(0, RoundingMode.UNNECESSARY).longValueExact();
        }
        return amount.multiply(BigDecimal.valueOf(100)).setScale(0, RoundingMode.UNNECESSARY).longValueExact();
    }

    private LocalDateTime toLocalDateTime(Long epochSeconds) {
        if (epochSeconds == null) {
            return LocalDateTime.now().plusHours(24);
        }
        return LocalDateTime.ofInstant(Instant.ofEpochSecond(epochSeconds), ZoneId.systemDefault());
    }

    private String appendQuery(String url, String... params) {
        String separator = url.contains("?") ? "&" : "?";
        return url + separator + String.join("&", params);
    }
}
