package com.clubverse.clubverse_backend.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Every service in this codebase throws a plain RuntimeException for both
 * "not found" and "bad input" cases (e.g. AuthService: "Invalid email or
 * password", "Email already registered"). Left unhandled, Spring turns those
 * into a 500 with an HTML whitelabel error page, which is unusable from the
 * frontend (fetch can't read a message out of it, and every failure looks
 * like a server crash instead of "wrong password" or "already registered").
 *
 * This handler converts them into small JSON bodies the API client can
 * read: { "message": "...", "status": 4xx, "timestamp": "..." }.
 *
 * Messages are matched by keyword to pick a reasonable status code. This is
 * a pragmatic stopgap, not a replacement for typed exceptions — a follow-up
 * would introduce real exception classes (NotFoundException,
 * AlreadyExistsException, InvalidCredentialsException) per service.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        String message = ex.getMessage() == null ? "Something went wrong" : ex.getMessage();
        HttpStatus status = statusFor(message);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", status.value());
        body.put("message", message);
        body.put("timestamp", Instant.now().toString());

        return ResponseEntity.status(status).body(body);
    }

    private HttpStatus statusFor(String message) {
        String lower = message.toLowerCase();

        if (lower.contains("invalid email or password")) {
            return HttpStatus.UNAUTHORIZED;
        }
        if (lower.contains("already registered") || lower.contains("already exists")) {
            return HttpStatus.CONFLICT;
        }
        if (lower.contains("not found")) {
            return HttpStatus.NOT_FOUND;
        }
        if (lower.contains("invalid")) {
            return HttpStatus.BAD_REQUEST;
        }
        return HttpStatus.BAD_REQUEST;
    }
}
