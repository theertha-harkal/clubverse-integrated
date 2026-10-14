package com.clubverse.clubverse_backend.service;

import com.clubverse.clubverse_backend.dto.RegistrationResponse;
import com.clubverse.clubverse_backend.entity.Event;
import com.clubverse.clubverse_backend.entity.Registration;
import com.clubverse.clubverse_backend.entity.User;
import com.clubverse.clubverse_backend.repository.EventRepository;
import com.clubverse.clubverse_backend.repository.RegistrationRepository;
import com.clubverse.clubverse_backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegistrationServiceTest {

    private static final Long EVENT_ID = 10L;
    private static final String EMAIL = "student@college.edu";

    @Mock
    private RegistrationRepository registrationRepository;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private RegistrationService registrationService;

    private User student;
    private Event event;

    @BeforeEach
    void setUp() {
        student = new User();
        student.setId(1L);
        student.setName("Test Student");
        student.setEmail(EMAIL);
        student.setRole(User.Role.STUDENT);

        event = new Event();
        event.setTitle("Hackathon");
        event.setEventDate(LocalDate.now().plusDays(10));
        event.setRegistrationDeadline(LocalDate.now().plusDays(5));
        event.setMaxRegistrations(2);
        event.setRegisteredCount(0);
    }

    private void givenUserAndEventExist() {
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(student));
        when(eventRepository.findById(EVENT_ID)).thenReturn(Optional.of(event));
    }

    @Test
    @DisplayName("TC-REG-01: valid registration is CONFIRMED and increments count")
    void register_success() {
        givenUserAndEventExist();
        when(registrationRepository.findByEventIdAndUserId(EVENT_ID, 1L))
                .thenReturn(Optional.empty());
        when(registrationRepository.save(any(Registration.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        RegistrationResponse response = registrationService.register(EVENT_ID, EMAIL);

        assertEquals("CONFIRMED", response.getStatus());
        assertEquals(EMAIL, response.getUserEmail());
        assertEquals(1, event.getRegisteredCount());
        verify(eventRepository).save(event);
    }

    @Test
    @DisplayName("TC-REG-02: unknown user is rejected")
    void register_userNotFound() {
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> registrationService.register(EVENT_ID, EMAIL));

        assertEquals("User not found", ex.getMessage());
        verifyNoInteractions(registrationRepository);
    }

    @Test
    @DisplayName("TC-REG-03: unknown event is rejected")
    void register_eventNotFound() {
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(student));
        when(eventRepository.findById(EVENT_ID)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> registrationService.register(EVENT_ID, EMAIL));

        assertEquals("Event not found", ex.getMessage());
    }

    @Test
    @DisplayName("TC-REG-04: duplicate registration is rejected")
    void register_duplicate() {
        givenUserAndEventExist();
        when(registrationRepository.findByEventIdAndUserId(EVENT_ID, 1L))
                .thenReturn(Optional.of(new Registration()));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> registrationService.register(EVENT_ID, EMAIL));

        assertEquals("User already registered for this event", ex.getMessage());
        verify(registrationRepository, never()).save(any());
    }

    @Test
    @DisplayName("TC-REG-05: registration after deadline is rejected")
    void register_deadlinePassed() {
        event.setRegistrationDeadline(LocalDate.now().minusDays(1));
        givenUserAndEventExist();

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> registrationService.register(EVENT_ID, EMAIL));

        assertEquals("Registration deadline has passed", ex.getMessage());
        verify(registrationRepository, never()).save(any());
    }

    @Test
    @DisplayName("TC-REG-06: registration on a full event is rejected")
    void register_eventFull() {
        event.setRegisteredCount(2);
        givenUserAndEventExist();

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> registrationService.register(EVENT_ID, EMAIL));

        assertEquals("Event registration is full", ex.getMessage());
        assertEquals(2, event.getRegisteredCount());
    }

    @Test
    @DisplayName("TC-REG-07: deadline today is still open (boundary)")
    void register_deadlineToday() {
        event.setRegistrationDeadline(LocalDate.now());
        givenUserAndEventExist();
        when(registrationRepository.findByEventIdAndUserId(EVENT_ID, 1L))
                .thenReturn(Optional.empty());
        when(registrationRepository.save(any(Registration.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        assertDoesNotThrow(() -> registrationService.register(EVENT_ID, EMAIL));
    }

    @Test
    @DisplayName("TC-REG-08: a user's registrations are listed")
    void getUserRegistrations() {
        Registration registration = new Registration();
        registration.setEvent(event);
        registration.setUser(student);
        registration.setStatus(Registration.Status.CONFIRMED);

        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(student));
        when(registrationRepository.findByUserId(1L)).thenReturn(List.of(registration));

        List<RegistrationResponse> result = registrationService.getUserRegistrations(EMAIL);

        assertEquals(1, result.size());
        assertEquals("Test Student", result.get(0).getUserName());
    }
}