package com.clubverse.clubverse_backend.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @ParameterizedTest(name = "TC-ERR-01: \"{0}\" -> HTTP {1}")
    @CsvSource({
            "Invalid email or password, 401",
            "Email already registered, 409",
            "User already registered for this event, 409",
            "Event not found, 404",
            "Invalid status. Use DRAFT, 400",
            "Event registration is full, 400"
    })
    void mapsMessageToStatus(String message, int expectedStatus) {
        ResponseEntity<Map<String, Object>> response =
                handler.handleRuntimeException(new RuntimeException(message));

        assertEquals(expectedStatus, response.getStatusCode().value());
        assertEquals(message, response.getBody().get("message"));
        assertEquals(expectedStatus, response.getBody().get("status"));
        assertNotNull(response.getBody().get("timestamp"));
    }

    @Test
    @DisplayName("TC-ERR-02: null message falls back to a generic message")
    void nullMessage() {
        ResponseEntity<Map<String, Object>> response =
                handler.handleRuntimeException(new RuntimeException());

        assertEquals(400, response.getStatusCode().value());
        assertEquals("Something went wrong", response.getBody().get("message"));
    }
}
