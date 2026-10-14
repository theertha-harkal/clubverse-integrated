package com.clubverse.clubverse_backend.api;

import com.clubverse.clubverse_backend.entity.User;
import com.clubverse.clubverse_backend.repository.UserRepository;
import com.jayway.jsonpath.JsonPath;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * API tests for event management (EventController): creating events,
 * listing/viewing them, and the approve/reject/cancel status workflow,
 * including role-based access rules from SecurityConfig.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class EventControllerApiTest {

    private static final String PASSWORD = "Test@123";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String clubAdminToken;
    private String platformAdminToken;
    private String studentToken;

    @BeforeEach
    void seedUsers() throws Exception {
        clubAdminToken = loginAs(saveUser("Coding Club", "club@college.edu", User.Role.CLUB_ADMIN));
        platformAdminToken = loginAs(saveUser("Campus Admin", "admin@college.edu", User.Role.PLATFORM_ADMIN));
        studentToken = loginAs(saveUser("Student", "student@college.edu", User.Role.STUDENT));
    }

    private String saveUser(String name, String email, User.Role role) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(PASSWORD));
        user.setRole(role);
        userRepository.save(user);
        return email;
    }

    private String loginAs(String email) throws Exception {
        String body = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"%s\",\"password\":\"%s\"}".formatted(email, PASSWORD)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return "Bearer " + JsonPath.read(body, "$.token");
    }

    private String eventJson(String title, boolean approvalRequired) {
        return """
                {"title":"%s","description":"Event for API testing","venue":"Main Auditorium",
                 "eventDate":"%s","registrationDeadline":"%s",
                 "maxRegistrations":100,"approvalRequired":%b,"tags":"tech,coding"}
                """.formatted(title, LocalDate.now().plusDays(10),
                LocalDate.now().plusDays(5), approvalRequired);
    }

    private Integer createEvent(String title, boolean approvalRequired) throws Exception {
        String body = mockMvc.perform(post("/api/events")
                        .header("Authorization", clubAdminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(eventJson(title, approvalRequired)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return JsonPath.read(body, "$.id");
    }

    @Test
    @DisplayName("TC-EVT-06: club admin creates an event -> PUBLISHED with organizer name")
    void clubAdminCreatesEvent() throws Exception {
        mockMvc.perform(post("/api/events")
                        .header("Authorization", clubAdminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(eventJson("Hackathon 2026", false)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.title").value("Hackathon 2026"))
                .andExpect(jsonPath("$.status").value("PUBLISHED"))
                .andExpect(jsonPath("$.registeredCount").value(0))
                .andExpect(jsonPath("$.organizerName").value("Coding Club"));
    }

    @Test
    @DisplayName("TC-EVT-07: event that requires approval is created as PENDING")
    void eventNeedingApprovalIsPending() throws Exception {
        mockMvc.perform(post("/api/events")
                        .header("Authorization", clubAdminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(eventJson("Cultural Night", true)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    @DisplayName("TC-EVT-08: student cannot create an event (403)")
    void studentCannotCreateEvent() throws Exception {
        mockMvc.perform(post("/api/events")
                        .header("Authorization", studentToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(eventJson("Unauthorized Event", false)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("TC-EVT-09: request without a login token is rejected (403)")
    void noTokenIsRejected() throws Exception {
        mockMvc.perform(get("/api/events"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("TC-EVT-10: any logged-in user can list all events")
    void listEvents() throws Exception {
        createEvent("Event A", false);
        createEvent("Event B", true);

        mockMvc.perform(get("/api/events").header("Authorization", studentToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[*].title").value(hasItems("Event A", "Event B")));
    }

    @Test
    @DisplayName("TC-EVT-11: view a single event by id")
    void getEventById() throws Exception {
        Integer id = createEvent("Robotics Workshop", false);

        mockMvc.perform(get("/api/events/{id}", id).header("Authorization", studentToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Robotics Workshop"))
                .andExpect(jsonPath("$.venue").value("Main Auditorium"));
    }

    @Test
    @DisplayName("TC-EVT-12: viewing a non-existent event returns 404")
    void missingEventIs404() throws Exception {
        mockMvc.perform(get("/api/events/{id}", 999_999).header("Authorization", studentToken))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Event not found"));
    }

    @Test
    @DisplayName("TC-EVT-13: platform admin approves a PENDING event -> PUBLISHED")
    void platformAdminApprovesEvent() throws Exception {
        Integer id = createEvent("Tech Fest", true);

        mockMvc.perform(put("/api/events/{id}/status", id)
                        .param("status", "PUBLISHED")
                        .header("Authorization", platformAdminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PUBLISHED"));
    }

    @Test
    @DisplayName("TC-EVT-14: platform admin rejects a PENDING event -> REJECTED")
    void platformAdminRejectsEvent() throws Exception {
        Integer id = createEvent("Late Night Party", true);

        mockMvc.perform(put("/api/events/{id}/status", id)
                        .param("status", "rejected")
                        .header("Authorization", platformAdminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("REJECTED"));
    }

    @Test
    @DisplayName("TC-EVT-15: club admin cancels their published event -> CANCELLED")
    void clubAdminCancelsEvent() throws Exception {
        Integer id = createEvent("Seminar", false);

        mockMvc.perform(put("/api/events/{id}/status", id)
                        .param("status", "CANCELLED")
                        .header("Authorization", clubAdminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CANCELLED"));
    }

    @Test
    @DisplayName("TC-EVT-16: student cannot change event status (403)")
    void studentCannotChangeStatus() throws Exception {
        Integer id = createEvent("Tech Talk", true);

        mockMvc.perform(put("/api/events/{id}/status", id)
                        .param("status", "PUBLISHED")
                        .header("Authorization", studentToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("TC-EVT-17: invalid status value returns 400")
    void invalidStatusIs400() throws Exception {
        Integer id = createEvent("Quiz", true);

        mockMvc.perform(put("/api/events/{id}/status", id)
                        .param("status", "ARCHIVED")
                        .header("Authorization", platformAdminToken))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(startsWith("Invalid status")));
    }
}
