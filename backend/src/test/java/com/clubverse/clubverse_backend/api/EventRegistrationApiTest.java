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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * End-to-end API tests: real security filter chain, JWT auth, controllers,
 * services and an in-memory H2 database, driven over HTTP via MockMvc.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class EventRegistrationApiTest {

    private static final String PASSWORD = "Test@123";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void seedClubAdmin() {
        User admin = new User();
        admin.setName("Coding Club");
        admin.setEmail("club@college.edu");
        admin.setPassword(passwordEncoder.encode(PASSWORD));
        admin.setRole(User.Role.CLUB_ADMIN);
        userRepository.save(admin);
    }

    private void signUp(String email) throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Student","email":"%s","password":"%s",
                                 "rollNumber":"2023BCS042","batch":"BTech2027","department":"CSE"}
                                """.formatted(email, PASSWORD)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("STUDENT"));
    }

    private String login(String email) throws Exception {
        String body = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"%s\",\"password\":\"%s\"}".formatted(email, PASSWORD)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return "Bearer " + JsonPath.read(body, "$.token");
    }

    private Integer createEvent(String adminToken, int maxRegistrations) throws Exception {
        String body = mockMvc.perform(post("/api/events")
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"title":"Hackathon","description":"24h build",
                                 "eventDate":"%s","registrationDeadline":"%s",
                                 "maxRegistrations":%d,"approvalRequired":false}
                                """.formatted(LocalDate.now().plusDays(10),
                                LocalDate.now().plusDays(5), maxRegistrations)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PUBLISHED"))
                .andExpect(jsonPath("$.organizerName").value("Coding Club"))
                .andReturn().getResponse().getContentAsString();
        return JsonPath.read(body, "$.id");
    }

    @Test
    @DisplayName("TC-API-01: protected endpoint without a token is denied")
    void noTokenIsForbidden() throws Exception {
        mockMvc.perform(get("/api/events"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("TC-API-02: wrong password returns 401 with JSON error")
    void wrongPasswordIs401() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"club@college.edu\",\"password\":\"nope\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Invalid email or password"));
    }

    @Test
    @DisplayName("TC-API-03: signing up twice with the same email returns 409")
    void duplicateSignUpIs409() throws Exception {
        signUp("dup@college.edu");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"X\",\"email\":\"dup@college.edu\",\"password\":\"x\"}"))
                .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("TC-API-04: a student cannot create events (role check)")
    void studentCannotCreateEvent() throws Exception {
        signUp("student@college.edu");
        String studentToken = login("student@college.edu");

        mockMvc.perform(post("/api/events")
                        .header("Authorization", studentToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"x\",\"description\":\"x\",\"eventDate\":\"2030-01-01\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("TC-API-05: full flow - admin creates event, student registers, duplicate is 409")
    void fullRegistrationFlow() throws Exception {
        String adminToken = login("club@college.edu");
        Integer eventId = createEvent(adminToken, 50);

        signUp("student@college.edu");
        String studentToken = login("student@college.edu");

        mockMvc.perform(post("/api/events/{id}/registrations", eventId)
                        .header("Authorization", studentToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CONFIRMED"))
                .andExpect(jsonPath("$.userEmail").value("student@college.edu"));

        mockMvc.perform(post("/api/events/{id}/registrations", eventId)
                        .header("Authorization", studentToken))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("User already registered for this event"));

        mockMvc.perform(get("/api/events/{id}", eventId)
                        .header("Authorization", studentToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.registeredCount").value(1));

        mockMvc.perform(get("/api/events/my-registrations")
                        .header("Authorization", studentToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    @DisplayName("TC-API-06: registering for a full event returns 400")
    void fullEventIs400() throws Exception {
        String adminToken = login("club@college.edu");
        Integer eventId = createEvent(adminToken, 1);

        signUp("first@college.edu");
        signUp("second@college.edu");

        mockMvc.perform(post("/api/events/{id}/registrations", eventId)
                        .header("Authorization", login("first@college.edu")))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/events/{id}/registrations", eventId)
                        .header("Authorization", login("second@college.edu")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Event registration is full"));
    }

    @Test
    @DisplayName("TC-API-07: event lookup for a missing id returns 404")
    void missingEventIs404() throws Exception {
        mockMvc.perform(get("/api/events/{id}", 999_999)
                        .header("Authorization", login("club@college.edu")))
                .andExpect(status().isNotFound());
    }
}
