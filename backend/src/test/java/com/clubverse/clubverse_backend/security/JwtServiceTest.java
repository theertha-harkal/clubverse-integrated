package com.clubverse.clubverse_backend.security;

import com.clubverse.clubverse_backend.entity.User;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private static final String SECRET = "TestOnlyJwtSecretKeyForClubverseAutomatedTests2026";

    private final JwtService jwtService = new JwtService(SECRET, 3_600_000);

    private User user() {
        User user = new User();
        user.setEmail("admin@college.edu");
        user.setRole(User.Role.PLATFORM_ADMIN);
        return user;
    }

    @Test
    @DisplayName("TC-JWT-01: token round-trips email and role")
    void generateAndParse() {
        String token = jwtService.generateToken(user());

        assertEquals("admin@college.edu", jwtService.extractEmail(token));
        assertEquals("PLATFORM_ADMIN", jwtService.extractRole(token));
    }

    @Test
    @DisplayName("TC-JWT-02: token signed with another key is rejected")
    void foreignSignatureRejected() {
        JwtService other = new JwtService("SomeCompletelyDifferentSecretKeyThatIsLongEnough!!", 3_600_000);
        String forged = other.generateToken(user());

        assertThrows(JwtException.class, () -> jwtService.extractEmail(forged));
    }

    @Test
    @DisplayName("TC-JWT-03: tampered token is rejected")
    void tamperedTokenRejected() {
        String token = jwtService.generateToken(user());
        String tampered = token.substring(0, token.length() - 2) + "xx";

        assertThrows(JwtException.class, () -> jwtService.extractRole(tampered));
    }

    @Test
    @DisplayName("TC-JWT-04: expired token is rejected")
    void expiredTokenRejected() {
        JwtService shortLived = new JwtService(SECRET, -1_000);
        String expired = shortLived.generateToken(user());

        assertThrows(ExpiredJwtException.class, () -> jwtService.extractEmail(expired));
    }
}
