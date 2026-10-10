
package com.clubverse.clubverse_backend;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

class PasswordHashTest {
    @Test
    void generatePasswordHash() {
        System.out.println("TEMP_HASH=" +
            new BCryptPasswordEncoder().encode("ClubAdminTest@2026"));
    }
}
