
package com.clubverse.clubverse_backend;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

class PasswordHashTest {

    @Test
    void generatePasswordHash() {
        String password = "club123";
        String hash = new BCryptPasswordEncoder().encode(password);
        System.out.println("BCrypt hash: " + hash);
    }
}
