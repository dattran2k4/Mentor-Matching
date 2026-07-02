package com.mentormatching.shared.exception;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.mentormatching.shared.response.ErrorResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ========== AUTHENTICATION EXCEPTIONS ==========
    @ExceptionHandler(AuthenticationFailedException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ErrorResponse handleAuthenticationFailed(AuthenticationFailedException ex,
                                                    HttpServletRequest request) {
        return buildAuthenticationErrorResponse(ErrorCode.AUTHENTICATION_FAILED, ex.getMessage(), request);
    }

    // ========== BUSINESS EXCEPTIONS ==========
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleResourceNotFound(ResourceNotFoundException ex,
                                                HttpServletRequest request) {
        return buildBusinessErrorResponse(ErrorCode.RESOURCE_NOT_FOUND, HttpStatus.NOT_FOUND, ex.getMessage(),
                request);
    }

    @ExceptionHandler(InvalidDataException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleInvalidData(InvalidDataException ex,
                                           HttpServletRequest request) {
        return buildBusinessErrorResponse(ErrorCode.INVALID_DATA, HttpStatus.BAD_REQUEST, ex.getMessage(),
                request);
    }

    // ========== VALIDATION EXCEPTIONS ==========
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                      HttpServletRequest request) {
        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(this::buildFieldValidationMessage)
                .collect(Collectors.joining("; "));

        return buildValidationErrorResponse(message, request);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleConstraintViolation(ConstraintViolationException ex,
                                                   HttpServletRequest request) {
        String message = ex.getConstraintViolations()
                .stream()
                .map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
                .collect(Collectors.joining("; "));

        return buildValidationErrorResponse(message, request);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleMissingServletRequestParameter(MissingServletRequestParameterException ex,
                                                              HttpServletRequest request) {
        String message = ex.getParameterName() + ": parameter is required";
        return buildValidationErrorResponse(message, request);
    }

    // ========== SYSTEM EXCEPTIONS ==========
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleUnexpected(Exception ex,
                                          HttpServletRequest request) {
        return buildSystemErrorResponse("Unexpected error occurred", request);
    }

    // ========== INTERNAL HELPERS ==========
    private String buildFieldValidationMessage(FieldError fieldError) {
        return fieldError.getField() + ": " + fieldError.getDefaultMessage();
    }

    private ErrorResponse buildAuthenticationErrorResponse(ErrorCode code, String message, HttpServletRequest request) {
        return buildErrorResponse(code, HttpStatus.UNAUTHORIZED, message, request);
    }

    private ErrorResponse buildBusinessErrorResponse(ErrorCode code, HttpStatus status, String message,
                                                     HttpServletRequest request) {
        return buildErrorResponse(code, status, message, request);
    }

    private ErrorResponse buildValidationErrorResponse(String message, HttpServletRequest request) {
        return buildErrorResponse(ErrorCode.VALIDATION_ERROR, HttpStatus.BAD_REQUEST, message, request);
    }

    private ErrorResponse buildSystemErrorResponse(String message, HttpServletRequest request) {
        return buildErrorResponse(ErrorCode.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR, message, request);
    }

    private ErrorResponse buildErrorResponse(ErrorCode code, HttpStatus status, String message,
                                             HttpServletRequest request) {
        return ErrorResponse.builder()
                .code(code.name())
                .status(status.value())
                .message(message)
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();
    }
}
