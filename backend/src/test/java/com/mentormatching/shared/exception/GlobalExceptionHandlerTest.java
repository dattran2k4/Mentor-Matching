package com.mentormatching.shared.exception;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.bind.MissingServletRequestParameterException;

import com.mentormatching.shared.response.ErrorResponse;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void shouldReturnStandardValidationErrorWhenRequestParameterIsMissing() {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/v1/mentors");
        MissingServletRequestParameterException exception =
                new MissingServletRequestParameterException("page", "Integer");

        ErrorResponse response = handler.handleMissingServletRequestParameter(exception, request);

        assertThat(response.code()).isEqualTo(ErrorCode.VALIDATION_ERROR.name());
        assertThat(response.status()).isEqualTo(400);
        assertThat(response.message()).isEqualTo("page: parameter is required");
        assertThat(response.path()).isEqualTo("/api/v1/mentors");
        assertThat(response.timestamp()).isNotNull();
    }
}
