package com.clubverse.clubverse_backend.service;

import com.clubverse.clubverse_backend.dto.EventRequest;
import com.clubverse.clubverse_backend.dto.EventResponse;
import com.clubverse.clubverse_backend.entity.Event;
import com.clubverse.clubverse_backend.entity.User;
import com.clubverse.clubverse_backend.repository.EventRepository;
import com.clubverse.clubverse_backend.repository.UserRepository;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    private static final String ORGANIZER_EMAIL = "club@college.edu";

    @Mock
    private EventRepository eventRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private EventService eventService;

    private User organizer() {
        User user = new User();
        user.setId(3L);
        user.setName("Coding Club");
        user.setEmail(ORGANIZER_EMAIL);
        user.setRole(User.Role.CLUB_ADMIN);
        return user;
    }

    private EventRequest eventRequest(boolean approvalRequired) {
        EventRequest request = new EventRequest();
        request.setTitle("Hackathon");
        request.setDescription("24h hackathon");
        request.setEventDate(LocalDate.now().plusDays(14));
        request.setMaxRegistrations(100);
        request.setApprovalRequired(approvalRequired);
        return request;
    }

    private void givenOrganizerAndSavePassThrough() {
        User organizer = organizer();
        when(userRepository.findByEmail(ORGANIZER_EMAIL)).thenReturn(Optional.of(organizer));
        when(userRepository.findById(3L)).thenReturn(Optional.of(organizer));
        when(eventRepository.save(any(Event.class))).thenAnswer(inv -> inv.getArgument(0));
    }

    @Test
    @DisplayName("TC-EVT-01: event needing approval is created as PENDING")
    void createEvent_pendingWhenApprovalRequired() {
        givenOrganizerAndSavePassThrough();

        EventResponse response = eventService.createEvent(eventRequest(true), ORGANIZER_EMAIL);

        assertEquals("PENDING", response.getStatus());
        assertEquals(0, response.getRegisteredCount());
        assertEquals("Coding Club", response.getOrganizerName());
    }

    @Test
    @DisplayName("TC-EVT-02: event without approval is PUBLISHED immediately")
    void createEvent_publishedWhenNoApproval() {
        givenOrganizerAndSavePassThrough();

        EventResponse response = eventService.createEvent(eventRequest(false), ORGANIZER_EMAIL);

        assertEquals("PUBLISHED", response.getStatus());
    }

    @ParameterizedTest(name = "TC-EVT-03: status \"{0}\" is accepted case-insensitively")
    @ValueSource(strings = {"published", "REJECTED", "Cancelled"})
    void updateStatus_valid(String status) {
        Event event = new Event();
        event.setOrganizerId(3L);
        event.setStatus(Event.Status.PENDING);
        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));
        when(eventRepository.save(event)).thenReturn(event);

        EventResponse response = eventService.updateStatus(1L, status);

        assertEquals(status.toUpperCase(), response.getStatus());
    }

    @Test
    @DisplayName("TC-EVT-04: unknown status value is rejected")
    void updateStatus_invalid() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(new Event()));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> eventService.updateStatus(1L, "ARCHIVED"));

        assertTrue(ex.getMessage().startsWith("Invalid status"));
        verify(eventRepository, never()).save(any());
    }

    @Test
    @DisplayName("TC-EVT-05: fetching a missing event fails with 'Event not found'")
    void getEvent_notFound() {
        when(eventRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> eventService.getEvent(99L));

        assertEquals("Event not found", ex.getMessage());
    }
}
