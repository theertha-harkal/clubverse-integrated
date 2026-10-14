package com.clubverse.clubverse_backend.service;

import com.clubverse.clubverse_backend.dto.LoginRequest;
import com.clubverse.clubverse_backend.dto.LoginResponse;
import com.clubverse.clubverse_backend.dto.RegisterRequest;
import com.clubverse.clubverse_backend.entity.User;
import com.clubverse.clubverse_backend.repository.UserRepository;
import com.clubverse.clubverse_backend.security.JwtService;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest() {
        RegisterRequest request = new RegisterRequest();
        request.setName("New Student");
        request.setEmail("new@college.edu");
        request.setPassword("Secret@123");
        request.setRollNumber("2023BCS001");
        request.setBatch("BTech2027");
        request.setDepartment("CSE");
        return request;
    }

    private LoginRequest loginRequest(String email, String password) {
        LoginRequest request = new LoginRequest();
        request.setEmail(email);
        request.setPassword(password);
        return request;
    }

    private User storedUser() {
        User user = new User();
        user.setId(7L);
        user.setName("Stored User");
        user.setEmail("stored@college.edu");
        user.setPassword("$2a$hashed");
        user.setRole(User.Role.CLUB_ADMIN);
        return user;
    }

    @Test
    @DisplayName("TC-AUTH-01: sign-up stores a hashed password and STUDENT role")
    void register_success() {
        when(userRepository.existsByEmail("new@college.edu")).thenReturn(false);
        when(passwordEncoder.encode("Secret@123")).thenReturn("$2a$hashed");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        authService.register(registerRequest());

        ArgumentCaptor<User> saved = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(saved.capture());
        assertEquals("$2a$hashed", saved.getValue().getPassword());
        assertNotEquals("Secret@123", saved.getValue().getPassword());
        assertEquals(User.Role.STUDENT, saved.getValue().getRole());
    }

    @Test
    @DisplayName("TC-AUTH-02: sign-up with an existing email is rejected")
    void register_duplicateEmail() {
        when(userRepository.existsByEmail("new@college.edu")).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.register(registerRequest()));

        assertEquals("Email already registered", ex.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("TC-AUTH-03: login with correct credentials returns a token")
    void login_success() {
        User user = storedUser();
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("Secret@123", user.getPassword())).thenReturn(true);
        when(jwtService.generateToken(user)).thenReturn("jwt-token");

        LoginResponse response = authService.login(loginRequest(user.getEmail(), "Secret@123"));

        assertEquals("jwt-token", response.getToken());
        assertEquals(7L, response.getUserId());
        assertEquals("CLUB_ADMIN", response.getRole());
    }

    @Test
    @DisplayName("TC-AUTH-04: login with wrong password is rejected")
    void login_wrongPassword() {
        User user = storedUser();
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", user.getPassword())).thenReturn(false);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.login(loginRequest(user.getEmail(), "wrong")));

        assertEquals("Invalid email or password", ex.getMessage());
        verifyNoInteractions(jwtService);
    }

    @Test
    @DisplayName("TC-AUTH-05: login with unknown email gives the same generic error")
    void login_unknownEmail() {
        when(userRepository.findByEmail("ghost@college.edu")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.login(loginRequest("ghost@college.edu", "x")));

        assertEquals("Invalid email or password", ex.getMessage());
    }
}
