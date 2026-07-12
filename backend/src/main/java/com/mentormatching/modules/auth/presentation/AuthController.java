package com.mentormatching.modules.auth.presentation;

import java.time.Duration;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mentormatching.modules.auth.application.dto.AuthResult;
import com.mentormatching.modules.auth.application.dto.LoginCommand;
import com.mentormatching.modules.auth.application.dto.LogoutCommand;
import com.mentormatching.modules.auth.application.dto.RefreshTokenCommand;
import com.mentormatching.modules.auth.application.dto.RegisterCommand;
import com.mentormatching.modules.auth.application.port.in.LoginUseCase;
import com.mentormatching.modules.auth.application.port.in.LogoutUseCase;
import com.mentormatching.modules.auth.application.port.in.RefreshTokenUseCase;
import com.mentormatching.modules.auth.application.port.in.RegisterUseCase;
import com.mentormatching.modules.auth.presentation.dto.request.LoginRequest;
import com.mentormatching.modules.auth.presentation.dto.request.RegisterRequest;
import com.mentormatching.modules.auth.presentation.dto.response.AuthResponse;
import com.mentormatching.shared.response.ApiResponse;
import com.mentormatching.shared.response.ApiResponseFactory;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping("/api/v1/auth")
@Slf4j(topic = "AUTH-CONTROLLER")
public class AuthController {

    private static final String REFRESH_TOKEN_COOKIE_NAME = "refresh_token";

    private final LoginUseCase loginUseCase;
    private final RegisterUseCase registerUseCase;
    private final RefreshTokenUseCase refreshTokenUseCase;
    private final LogoutUseCase logoutUseCase;
    private final ApiResponseFactory apiResponseFactory;

    @Value("${app.refresh-token.cookie.path:/api/v1/auth}")
    private String refreshTokenCookiePath;

    @Value("${app.refresh-token.cookie.secure:false}")
    private boolean refreshTokenCookieSecure;

    @Value("${app.refresh-token.cookie.same-site:Strict}")
    private String refreshTokenCookieSameSite;

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request,
                                           HttpServletResponse response) {
        AuthResult result = loginUseCase.login(new LoginCommand(request.email(), request.password()));
        addRefreshTokenCookie(response, result);
        return apiResponseFactory.success(AuthResponse.from(result), "Login successfully");
    }

    @PostMapping("/register")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request,
                                              HttpServletResponse response) {
        AuthResult result = registerUseCase.register(new RegisterCommand(request.fullName(), request.email(),
                request.phone(), request.userType(), request.password(), request.confirmPassword()));

        addRefreshTokenCookie(response, result);
        return apiResponseFactory.created(AuthResponse.from(result), "Register successfully");
    }

    @PostMapping("/refresh-token")
    public ApiResponse<AuthResponse> refreshToken(@CookieValue(name = REFRESH_TOKEN_COOKIE_NAME, required = false) String refreshToken,
                                                  HttpServletResponse response) {
        AuthResult result = refreshTokenUseCase.refreshToken(new RefreshTokenCommand(refreshToken));
        addRefreshTokenCookie(response, result);
        return apiResponseFactory.success(AuthResponse.from(result), "Refresh token successfully");
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(@CookieValue(name = REFRESH_TOKEN_COOKIE_NAME, required = false) String refreshToken,
                                    HttpServletResponse response) {
        log.info("Request for logout, refreshToken={}", refreshToken);
        logoutUseCase.logout(new LogoutCommand(refreshToken));
        clearRefreshTokenCookie(response);
        return apiResponseFactory.success(null, "Logout successfully");
    }

    private void addRefreshTokenCookie(HttpServletResponse response, AuthResult result) {
        ResponseCookie cookie = ResponseCookie.from(REFRESH_TOKEN_COOKIE_NAME, result.refreshToken())
                .httpOnly(true)
                .secure(refreshTokenCookieSecure)
                .sameSite(refreshTokenCookieSameSite)
                .path(refreshTokenCookiePath)
                .maxAge(Duration.ofSeconds(result.refreshTokenExpiresIn()))
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void clearRefreshTokenCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(REFRESH_TOKEN_COOKIE_NAME, "")
                .httpOnly(true)
                .secure(refreshTokenCookieSecure)
                .sameSite(refreshTokenCookieSameSite)
                .path(refreshTokenCookiePath)
                .maxAge(Duration.ZERO)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
