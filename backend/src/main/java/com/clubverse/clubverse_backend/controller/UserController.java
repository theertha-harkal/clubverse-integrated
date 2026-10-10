
package com.clubverse.clubverse_backend.controller;

import com.clubverse.clubverse_backend.entity.User;
import com.clubverse.clubverse_backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/students")
    public ResponseEntity<List<StudentResponse>> getStudents() {
        List<StudentResponse> students = userRepository.findAll()
                .stream()
                .filter(user -> user.getRole() == User.Role.STUDENT)
                .map(user -> new StudentResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRollNumber(),
                        user.getBatch(),
                        user.getDepartment(),
                        user.getRole().name()
                ))
                .toList();

        return ResponseEntity.ok(students);
    }

    public record StudentResponse(
            Long id,
            String name,
            String email,
            String rollNumber,
            String batch,
            String department,
            String role
    ) {}
}
