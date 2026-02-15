package org.example.portfolioai.service;

import lombok.RequiredArgsConstructor;
import org.example.portfolioai.dto.PortfolioRequestDTO;
import org.example.portfolioai.dto.PortfolioResponseDTO;
import org.example.portfolioai.entity.PortfolioEntity;
import org.example.portfolioai.exception.ResourceNotFoundException;
import org.example.portfolioai.repository.PortfolioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final org.example.portfolioai.repository.UserRepository userRepository;

    private org.example.portfolioai.entity.UserEntity getCurrentUser() {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication()
                .getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional(readOnly = true)
    public List<PortfolioResponseDTO> getAllPortfolios() {
        org.example.portfolioai.entity.UserEntity user = getCurrentUser();
        return portfolioRepository.findAllByUserOrderByCreatedAtDesc(user).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PortfolioResponseDTO getPortfolioById(Long id) {
        org.example.portfolioai.entity.UserEntity user = getCurrentUser();
        PortfolioEntity entity = portfolioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found with id: " + id));

        if (!entity.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        return mapToDTO(entity);
    }

    @Transactional
    public PortfolioResponseDTO createPortfolio(PortfolioRequestDTO request) {
        org.example.portfolioai.entity.UserEntity user = getCurrentUser();

        PortfolioEntity entity = PortfolioEntity.builder()
                .role(request.getRole())
                .skills(request.getSkills())
                .experience(request.getExperience())
                .projects(request.getProjects())
                .generatedBio(request.getGeneratedBio())
                .generatedHtml(request.getGeneratedHtml())
                .user(user)
                .build();

        PortfolioEntity saved = portfolioRepository.save(entity);
        return mapToDTO(saved);
    }

    @Transactional
    public PortfolioResponseDTO updatePortfolio(Long id, PortfolioRequestDTO request) {
        org.example.portfolioai.entity.UserEntity user = getCurrentUser();
        PortfolioEntity entity = portfolioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found with id: " + id));

        if (!entity.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        entity.setRole(request.getRole());
        entity.setSkills(request.getSkills());
        entity.setExperience(request.getExperience());
        entity.setProjects(request.getProjects());
        if (request.getGeneratedBio() != null && !request.getGeneratedBio().isEmpty()) {
            entity.setGeneratedBio(request.getGeneratedBio());
        }
        if (request.getGeneratedHtml() != null && !request.getGeneratedHtml().isEmpty()) {
            entity.setGeneratedHtml(request.getGeneratedHtml());
        }

        PortfolioEntity updated = portfolioRepository.save(entity);
        return mapToDTO(updated);
    }

    @Transactional
    public void deletePortfolio(Long id) {
        org.example.portfolioai.entity.UserEntity user = getCurrentUser();
        PortfolioEntity entity = portfolioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found with id: " + id));

        if (!entity.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        portfolioRepository.delete(entity);
    }

    @Transactional(readOnly = true)
    public Resource downloadPortfolio(Long id) {
        org.example.portfolioai.entity.UserEntity user = getCurrentUser();
        PortfolioEntity entity = portfolioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found with id: " + id));

        if (!entity.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
                ZipOutputStream zos = new ZipOutputStream(baos)) {

            // Create index.html entry
            ZipEntry entry = new ZipEntry("index.html");
            zos.putNextEntry(entry);
            String htmlContent = entity.getGeneratedHtml() != null ? entity.getGeneratedHtml()
                    : "<html><body><h1>No content generated</h1></body></html>";
            zos.write(htmlContent.getBytes());
            zos.closeEntry();

            zos.finish();
            return new ByteArrayResource(baos.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Failed to zip portfolio", e);
        }
    }

    private PortfolioResponseDTO mapToDTO(PortfolioEntity entity) {
        return PortfolioResponseDTO.builder()
                .id(entity.getId())
                .role(entity.getRole())
                .skills(entity.getSkills())
                .experience(entity.getExperience())
                .projects(entity.getProjects())
                .generatedBio(entity.getGeneratedBio())
                .generatedHtml(entity.getGeneratedHtml())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
