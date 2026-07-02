package com.mentormatching.modules.notification.infrastructure.websocket.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import com.mentormatching.modules.notification.infrastructure.websocket.interceptor.StompAuthChannelInterceptor;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final StompAuthChannelInterceptor stompAuthChannelInterceptor;

    public WebSocketConfig(StompAuthChannelInterceptor stompAuthChannelInterceptor) {
        this.stompAuthChannelInterceptor = stompAuthChannelInterceptor;
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register the STOMP endpoint for notifications
        registry.addEndpoint("/ws/notifications")
                .setAllowedOriginPatterns("*"); // Allow all origins for testing/development
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Simple memory broker for /queue and /topic destinations
        registry.enableSimpleBroker("/queue", "/topic");
        
        // Prefix for messages sent FROM client TO server (e.g., @MessageMapping)
        registry.setApplicationDestinationPrefixes("/app");
        
        // Prefix used to identify user destinations
        registry.setUserDestinationPrefix("/user");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        // Intercept incoming messages (specifically CONNECT) to validate JWT token
        registration.interceptors(stompAuthChannelInterceptor);
    }
}
