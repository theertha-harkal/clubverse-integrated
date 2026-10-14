package com.clubverse.clubverse_backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println("JWT Filter: doFilterInternal called");
         String authHeader = request.getHeader("Authorization");

         System.out.println("JWT Filter: authHeader = " + authHeader);

         if (authHeader == null || !authHeader.startsWith("Bearer ")) {
             filterChain.doFilter(request, response);
             return;
         }

        System.out.println("JWT Filter: About to extract token");
        String token = authHeader.substring(7);

        try {
            System.out.println("JWT Filter: Inside try block");
            String email = jwtService.extractEmail(token);
            String role = jwtService.extractRole(token);
            System.out.println("JWT Filter: email=" + email + ", role=" + role);

            if (email != null
                    && role != null
                    && SecurityContextHolder.getContext().getAuthentication() == null) {

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                java.util.List.of(
                                        new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                "ROLE_" + role
                                        )
                                )
                        );

                    authentication.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("JWT Filter: Authentication set for " + email);
                } else {
                    System.out.println("JWT Filter: Not setting authentication because email=null: " + (email == null) + ", role=null: " + (role == null) + ", auth already present: " + (SecurityContextHolder.getContext().getAuthentication() != null));
                }

            } catch (Exception e) {
            System.out.println("JWT ERROR: " + e.getMessage());
            e.printStackTrace();
        }

        filterChain.doFilter(request, response);
    }
}