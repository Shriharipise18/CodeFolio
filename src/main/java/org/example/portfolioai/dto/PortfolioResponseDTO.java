package org.example.portfolioai.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PortfolioResponseDTO {
    private Long id;
    private String role;
    private String skills;
    private String experience;
    private String projects;
    private String generatedBio;
    private String generatedHtml;
    private LocalDateTime createdAt;
}
