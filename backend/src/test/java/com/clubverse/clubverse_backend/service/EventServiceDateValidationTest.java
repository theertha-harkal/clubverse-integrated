
package com.clubverse.clubverse_backend.service;

import com.clubverse.clubverse_backend.dto.EventRequest;
import com.clubverse.clubverse_backend.repository.EventRepository;
import com.clubverse.clubverse_backend.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventServiceDateValidationTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private EventService eventService;

    private EventRequest request;

    @BeforeEach
    void setUp() {
        request = new EventRequest();
    }

    @Test
    void rejectsPastEventDate() {
        request.setEventDate(LocalDate.now().minusDays(1));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> eventService.createEvent(request, "test@college.edu")
        );

        assertEquals(
                "Event date cannot be in the past or empty",
                exception.getMessage()
        );
        verifyNoInteractions(userRepository, eventRepository);
    }

    @Test
    void rejectsNullEventDate() {
        request.setEventDate(null);

        assertThrows(
                IllegalArgumentException.class,
                () -> eventService.createEvent(request, "test@college.edu")
        );

        verifyNoInteractions(userRepository, eventRepository);
    }
}
