package org.example.portfolioai.controller;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.example.portfolioai.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            String token = authService.register(request.getEmail(), request.getPassword(), request.getFullName());
            return ResponseEntity.ok(java.util.Collections.singletonMap("token", token));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Collections.singletonMap("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Map<String, String> data = authService.login(request.getEmail(), request.getPassword());
            return ResponseEntity.ok(data);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Collections.singletonMap("error", e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(java.security.Principal principal) {
        try {
            Map<String, String> data = authService.getUser(principal.getName());
            return ResponseEntity.ok(data);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Collections.singletonMap("error", e.getMessage()));
        }
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(java.security.Principal principal,
            @RequestBody UpdateProfileRequest request) {
        try {
            Map<String, String> data = authService.updateProfile(principal.getName(),
                    request.getFullName(),
                    request.getPassword(),
                    request.getBio(),
                    request.getSkills(),
                    request.getExperience(),
                    request.getProjects());
            return ResponseEntity.ok(data);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Collections.singletonMap("error", e.getMessage()));
        }
    }

    @Data
    public static class RegisterRequest {
        private String email;
        private String password;
        private String fullName;
    }

    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    public static class UpdateProfileRequest {
        private String fullName;
        private String password;
        private String bio;
        private String skills;
        private String experience;
        private String projects;
    }
}
