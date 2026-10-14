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

            // Create a campus (platform) admin user if not exists
            String campusAdminEmail = "campusadmin@test.com";
            if (!userRepository.existsByEmail(campusAdminEmail)) {
                User campusAdmin = new User();
                campusAdmin.setName("Campus Admin");
                campusAdmin.setEmail(campusAdminEmail);
                campusAdmin.setPassword(passwordEncoder.encode("campuspass"));
                campusAdmin.setRole(User.Role.PLATFORM_ADMIN);
                // optional fields
                campusAdmin.setBatch("2024");
                campusAdmin.setDepartment("ADMIN");
                campusAdmin.setRollNumber("CAMPUS001");
                userRepository.save(campusAdmin);
                System.out.println("Created campus admin user: " + campusAdminEmail);
            }
        };
    }
}