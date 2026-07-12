package com.mentormatching.modules.notification.infrastructure.websocket.interceptor;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

import com.mentormatching.shared.security.jwt.JwtTokenProvider;
import com.mentormatching.shared.security.model.AuthenticatedUser;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
public class StompAuthChannelInterceptor implements ChannelInterceptor {

    private final JwtTokenProvider jwtTokenProvider;

    public StompAuthChannelInterceptor(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authHeader = accessor.getFirstNativeHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                try {
                    AuthenticatedUser user = jwtTokenProvider.parseToken(token);
                    if (user != null) {
                        // User's principal name must be exactly their ID for convertAndSendToUser to work properly.
                        UsernamePasswordAuthenticationToken authentication = 
                            new UsernamePasswordAuthenticationToken(String.valueOf(user.id()), null, null);
                        accessor.setUser(authentication);
                    }
                } catch (Exception e) {
                    // Ignore, authentication fails, and connection might be rejected by security layer if required
                }
            }
        }
        return message;
    }
}
