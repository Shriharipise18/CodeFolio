package org.example.portfolioai.dto;

import javax.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PortfolioRequestDTO {
    @NotBlank(message = "Role is required")
    private String role;

    @NotBlank(message = "Skills are required")
    private String skills;

    @NotBlank(message = "Experience is required")
    private String experience;

    @NotBlank(message = "Projects are required")
    private String projects;

    private String name;
    private String email;
    private String phone;
    private String linkedin;
    private String github;

    private String themeColor;
    private String fontStyle;
    private String backgroundStyle;
    private String sectionSpacing;
    private String cornerStyle;
    private String template;

    private String profileImageBase64;

    private java.util.List<String> sectionOrder;

    private String generatedBio;

    private String generatedHtml;
}
