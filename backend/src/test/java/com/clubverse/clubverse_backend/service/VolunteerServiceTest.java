package com.clubverse.clubverse_backend.service;

import com.clubverse.clubverse_backend.dto.VolunteerApplicationRequest;
import com.clubverse.clubverse_backend.dto.VolunteerApplicationResponse;
import com.clubverse.clubverse_backend.dto.VolunteerOpportunityRequest;
import com.clubverse.clubverse_backend.dto.VolunteerOpportunityResponse;
import com.clubverse.clubverse_backend.entity.Event;
import com.clubverse.clubverse_backend.entity.User;
import com.clubverse.clubverse_backend.entity.VolunteerApplication;
import com.clubverse.clubverse_backend.entity.VolunteerOpportunity;
import com.clubverse.clubverse_backend.repository.EventRepository;
import com.clubverse.clubverse_backend.repository.UserRepository;
import com.clubverse.clubverse_backend.repository.VolunteerApplicationRepository;
import com.clubverse.clubverse_backend.repository.VolunteerOpportunityRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VolunteerServiceTest {

    private static final Long OPPORTUNITY_ID = 10L;
    private static final String EMAIL = "student@college.edu";

    @Mock
    private VolunteerApplicationRepository applicationRepository;

    @Mock
    private VolunteerOpportunityRepository opportunityRepository;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private VolunteerService volunteerService;

    private User student;
    private VolunteerOpportunity opportunity;
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

        opportunity = new VolunteerOpportunity();
        opportunity.setEvent(event);
        opportunity.setRole("Mentor");
        opportunity.setTeam("Tech");
        opportunity.setRequirements("Java experience");
        opportunity.setRewardXp(100);
        opportunity.setApplicationDeadline(LocalDate.now().plusDays(5));
        opportunity.setTotalSlots(2);
        opportunity.setFilledSlots(0);
        opportunity.setActive(true);
    }

    private void givenUserAndOpportunityExist() {
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(student));
        when(opportunityRepository.findById(OPPORTUNITY_ID)).thenReturn(Optional.of(opportunity));
    }

    @Test
    @DisplayName("TC-VOL-01: valid application is PENDING")
    void apply_success() {
        givenUserAndOpportunityExist();
        when(applicationRepository.save(any(VolunteerApplication.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        VolunteerApplicationRequest request = new VolunteerApplicationRequest();
        request.setApplicationMessage("I want to help");

        VolunteerApplicationResponse response = volunteerService.apply(OPPORTUNITY_ID, request, EMAIL);

        assertEquals("PENDING", response.getStatus());
        assertEquals(EMAIL, response.getUserEmail());
        assertEquals("Mentor", response.getRole());
    }

    @Test
    @DisplayName("TC-VOL-02: unknown user is rejected")
    void apply_userNotFound() {
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.empty());

        VolunteerApplicationRequest request = new VolunteerApplicationRequest();

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> volunteerService.apply(OPPORTUNITY_ID, request, EMAIL));

        assertEquals("User not found", ex.getMessage());
        verifyNoInteractions(applicationRepository);
    }

    @Test
    @DisplayName("TC-VOL-03: unknown opportunity is rejected")
    void apply_opportunityNotFound() {
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(student));
        when(opportunityRepository.findById(OPPORTUNITY_ID)).thenReturn(Optional.empty());

        VolunteerApplicationRequest request = new VolunteerApplicationRequest();

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> volunteerService.apply(OPPORTUNITY_ID, request, EMAIL));

        assertEquals("Volunteer opportunity not found", ex.getMessage());
    }

    @Test
    @DisplayName("TC-VOL-04: inactive opportunity is rejected")
    void apply_inactiveOpportunity() {
        opportunity.setActive(false);
        givenUserAndOpportunityExist();

        VolunteerApplicationRequest request = new VolunteerApplicationRequest();

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> volunteerService.apply(OPPORTUNITY_ID, request, EMAIL));

        assertEquals("Volunteer opportunity is not active", ex.getMessage());
        verify(applicationRepository, never()).save(any());
    }

    @Test
    @DisplayName("TC-VOL-05: application after deadline is rejected")
    void apply_deadlinePassed() {
        opportunity.setApplicationDeadline(LocalDate.now().minusDays(1));
        givenUserAndOpportunityExist();

        VolunteerApplicationRequest request = new VolunteerApplicationRequest();

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> volunteerService.apply(OPPORTUNITY_ID, request, EMAIL));

        assertEquals("Volunteer application deadline has passed", ex.getMessage());
        verify(applicationRepository, never()).save(any());
    }

    @Test
    @DisplayName("TC-VOL-06: application to full opportunity is rejected")
    void apply_opportunityFull() {
        opportunity.setFilledSlots(2);
        givenUserAndOpportunityExist();

        VolunteerApplicationRequest request = new VolunteerApplicationRequest();

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> volunteerService.apply(OPPORTUNITY_ID, request, EMAIL));

        assertEquals("Volunteer opportunity is full", ex.getMessage());
        verify(applicationRepository, never()).save(any());
    }

    @Test
    @DisplayName("TC-VOL-07: duplicate application is rejected")
    void apply_duplicate() {
        givenUserAndOpportunityExist();
        when(applicationRepository.findByOpportunityIdAndUserId(OPPORTUNITY_ID, 1L))
                .thenReturn(Optional.of(new VolunteerApplication()));

        VolunteerApplicationRequest request = new VolunteerApplicationRequest();

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> volunteerService.apply(OPPORTUNITY_ID, request, EMAIL));

        assertEquals("User already applied for this opportunity", ex.getMessage());
        verify(applicationRepository, never()).save(any());
    }

    @Test
    @DisplayName("TC-VOL-08: a user's applications are listed")
    void getMyApplications() {
        VolunteerApplication application = new VolunteerApplication();
        application.setOpportunity(opportunity);
        application.setUser(student);
        application.setStatus(VolunteerApplication.Status.PENDING);
        application.setAppliedAt(LocalDateTime.now());

        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(student));
        when(applicationRepository.findByUserId(1L)).thenReturn(List.of(application));

        List<VolunteerApplicationResponse> result = volunteerService.getMyApplications(EMAIL);

        assertEquals(1, result.size());
        assertEquals("Test Student", result.get(0).getUserName());
    }
}