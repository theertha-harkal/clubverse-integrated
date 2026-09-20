package com.clubverse.clubverse_backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Previously missing: without .cors(...) here, Spring Security
                // never consulted the CorsConfigurationSource bean, so browser
                // preflight (OPTIONS) requests from the Vite frontend were
                // rejected before CORS headers were ever added. See CorsConfig.
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
        // Public
        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
        .requestMatchers(
                "/api/auth/register",
                "/api/auth/login"
        ).permitAll()

        // Published announcements are read by students too (HomeFeed /
        // CampusAnnouncements), not just club/campus admins - previously
        // this fell under the CLUB_ADMIN/PLATFORM_ADMIN-only rule below
        // and returned 403 for students.
        .requestMatchers(HttpMethod.GET, "/api/announcements/published")
                .authenticated()

        // Students submit reports (reporting a post/event/user); only
        // reading the report queue is admin-only.
        .requestMatchers(HttpMethod.POST, "/api/reports").authenticated()
        .requestMatchers(HttpMethod.GET, "/api/reports", "/api/reports/page")
                .hasRole("PLATFORM_ADMIN")

        // Event status changes: PLATFORM_ADMIN approves/rejects pending
        // events (EventApprovalQueue); CLUB_ADMIN may only cancel their own
        // already-published event (EventManagement's "Cancel" action) - the
        // frontend never lets a club admin self-publish a PENDING event,
        // but the endpoint itself can't tell "cancel" from "approve" apart,
        // so both roles need access and the frontend enforces the rest.
        .requestMatchers(HttpMethod.PUT, "/api/events/*/status")
                .hasAnyRole("CLUB_ADMIN", "PLATFORM_ADMIN")

        // Creating events/volunteer opportunities and managing volunteer
        // applications are club-admin (or platform-admin) actions.
        .requestMatchers(HttpMethod.POST, "/api/events")
                .hasAnyRole("CLUB_ADMIN", "PLATFORM_ADMIN")
        .requestMatchers(HttpMethod.POST, "/api/volunteer/opportunities")
                .hasAnyRole("CLUB_ADMIN", "PLATFORM_ADMIN")
        .requestMatchers(HttpMethod.PUT, "/api/volunteer/applications/*/status")
                .hasAnyRole("CLUB_ADMIN", "PLATFORM_ADMIN")

        // Remaining announcement management (create/draft/list-all/status)
        // stays admin-only.
        .requestMatchers(
                "/api/announcements/**"
        ).hasAnyRole("CLUB_ADMIN", "PLATFORM_ADMIN")

        // Any authenticated user (posts, comments, events GET, own
        // registrations, volunteer opportunities GET, applying to a role)
        .anyRequest().authenticated()
)
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}