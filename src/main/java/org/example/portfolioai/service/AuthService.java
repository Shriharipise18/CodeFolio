package org.example.portfolioai.service;

import lombok.RequiredArgsConstructor;
import org.example.portfolioai.entity.UserEntity;
import org.example.portfolioai.repository.UserRepository;
import org.example.portfolioai.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public java.util.Optional<UserEntity> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public String register(String email, String password, String fullName) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }
        UserEntity user = UserEntity.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .fullName(fullName)
                .build();
        userRepository.save(user);
        return jwtUtil.generateToken(email);
    }

    public java.util.Map<String, String> login(String email, String password) {
        Optional<UserEntity> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            UserEntity user = userOpt.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                java.util.Map<String, String> map = new java.util.HashMap<>();
                map.put("token", jwtUtil.generateToken(email));
                map.put("email", user.getEmail());
                map.put("fullName", user.getFullName());
                return map;
            }
        }
        throw new RuntimeException("Invalid email or password");
    }

    public java.util.Map<String, String> getUser(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        java.util.Map<String, String> map = new java.util.HashMap<>();
        map.put("email", user.getEmail());
        map.put("fullName", user.getFullName());
        map.put("bio", user.getBio());
        map.put("skills", user.getSkills());
        map.put("experience", user.getExperience());
        map.put("projects", user.getProjects());
        return map;
    }

    public org.example.portfolioai.dto.PortfolioRequestDTO updateResumeData(String email,
            org.example.portfolioai.dto.PortfolioRequestDTO data) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setBio(data.getGeneratedBio());
        user.setSkills(data.getSkills());
        user.setExperience(data.getExperience());
        user.setProjects(data.getProjects());

        userRepository.save(user);

        return data;
    }

    public java.util.Map<String, String> updateProfile(String email, String fullName, String newPassword,
            String bio, String skills, String experience, String projects) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (fullName != null && !fullName.trim().isEmpty()) {
            user.setFullName(fullName);
        }

        if (newPassword != null && !newPassword.trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(newPassword));
        }

        if (bio != null)
            user.setBio(bio);
        if (skills != null)
            user.setSkills(skills);
        if (experience != null)
            user.setExperience(experience);
        if (projects != null)
            user.setProjects(projects);

        userRepository.save(user);

        java.util.Map<String, String> map = new java.util.HashMap<>();
        map.put("email", user.getEmail());
        map.put("fullName", user.getFullName());
        map.put("bio", user.getBio());
        map.put("skills", user.getSkills());
        map.put("experience", user.getExperience());
        map.put("projects", user.getProjects());
        return map;
    }
}
