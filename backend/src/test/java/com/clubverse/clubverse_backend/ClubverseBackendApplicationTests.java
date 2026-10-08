package com.clubverse.clubverse_backend;

import com.clubverse.clubverse_backend.entity.Event;
import com.clubverse.clubverse_backend.entity.Registration;
import com.clubverse.clubverse_backend.entity.User;
import com.clubverse.clubverse_backend.repository.EventRepository;
import com.clubverse.clubverse_backend.repository.RegistrationRepository;
import com.clubverse.clubverse_backend.repository.UserRepository;
import com.clubverse.clubverse_backend.service.RegistrationService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class ClubverseBackendApplicationTests {

    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private RegistrationRepository registrationRepository;

    @Test
    void testEventRegistration() {

        // Create a test student
        User user = new User();
        user.setName("JUnit Student");
        user.setEmail("junit" + System.currentTimeMillis() + "@college.edu");
        user.setPassword("Test@123");
        user.setRole(User.Role.STUDENT);
        user.setRollNumber("TEST001");
        user.setBatch("BTech2028");
        user.setDepartment("CSE");

        user = userRepository.save(user);

        // Create a test event
        Event event = new Event();
        event.setTitle("JUnit Test Event");
        event.setDescription("Event created for JUnit testing");
        event.setEventDate(LocalDate.now().plusDays(10));
        event.setRegistrationDeadline(LocalDate.now().plusDays(5));
        event.setMaxRegistrations(10);
        event.setRegisteredCount(0);
        event.setFreeEntry(true);

        event = eventRepository.save(event);

        // Register the student
        var response =
                registrationService.register(
                        event.getId(),
                        user.getEmail()
                );

        // Verify registration response
        assertNotNull(response);

        // Verify registration is stored in database
        Optional<Registration> registration =
                registrationRepository
                        .findByEventIdAndUserId(
                                event.getId(),
                                user.getId()
                        );

        assertTrue(registration.isPresent());

        // Verify registration status
        assertEquals(
                Registration.Status.CONFIRMED,
                registration.get().getStatus()
        );

        // Verify event registered count increased
        Event updatedEvent =
                eventRepository
                        .findById(event.getId())
                        .orElseThrow();

        assertEquals(
                1,
                updatedEvent.getRegisteredCount()
        );

        // Verify duplicate registration is rejected
        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () -> registrationService.register(
                                event.getId(),
                                user.getEmail()
                        )
                );

        assertEquals(
                "User already registered for this event",
                exception.getMessage()
        );
    }
}