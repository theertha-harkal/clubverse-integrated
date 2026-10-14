package com.clubverse.clubverse_backend.security;

import com.clubverse.clubverse_backend.entity.User;
import com.clubverse.clubverse_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Create an admin user if not exists
            String adminEmail = "admin@test.com";
            if (!userRepository.existsByEmail(adminEmail)) {
                User adminUser = new User();
                adminUser.setName("Admin User");
                adminUser.setEmail(adminEmail);
                adminUser.setPassword(passwordEncoder.encode("adminpass"));
                adminUser.setRole(User.Role.CLUB_ADMIN);
                // optional fields
                adminUser.setBatch("2024");
                adminUser.setDepartment("CSE");
                adminUser.setRollNumber("ADMIN001");
                userRepository.save(adminUser);
                System.out.println("Created admin user: " + adminEmail);
            }
        };
    }
}