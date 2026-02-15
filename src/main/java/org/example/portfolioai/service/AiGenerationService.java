package org.example.portfolioai.service;

import org.example.portfolioai.dto.AiRequestDTO;
import org.example.portfolioai.dto.AiResponseDTO;
// Removed unused import
import org.example.portfolioai.dto.PortfolioRequestDTO;
import org.example.portfolioai.util.PromptBuilder;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

@Service
public class AiGenerationService {

    private final RestTemplate restTemplate;

    @Value("${ai.api.url}")
    private String apiUrl;

    @Value("${ai.api.key}")
    private String apiKey;

    @Value("${ai.api.model}")
    private String model;

    private final ObjectMapper objectMapper;

    public AiGenerationService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public String generateBio(PortfolioRequestDTO request) {
        String prompt = PromptBuilder.buildBioPrompt(
                request.getRole(),
                request.getSkills(),
                request.getExperience(),
                request.getProjects());

        AiRequestDTO aiRequest = AiRequestDTO.builder()
                .model(model)
                .messages(Collections.singletonList(new AiRequestDTO.Message("user", prompt)))
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<AiRequestDTO> entity = new HttpEntity<>(aiRequest, headers);

        try {
            ResponseEntity<AiResponseDTO> response = restTemplate.postForEntity(apiUrl, entity, AiResponseDTO.class);
            AiResponseDTO responseBody = response.getBody();
            if (responseBody != null && responseBody.getChoices() != null
                    && !responseBody.getChoices().isEmpty()) {
                return responseBody.getChoices().get(0).getMessage().getContent().trim();
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to generate bio from AI service: " + e.getMessage());
        }

        return "Bio generation failed.";
    }

    public String generateWebsite(PortfolioRequestDTO request) {
        System.out.println("Generating website for template: " + request.getTemplate());
        String prompt = PromptBuilder.buildWebsitePrompt(
                request.getRole(),
                request.getSkills(),
                request.getExperience(),
                request.getProjects(),
                request.getName(),
                request.getEmail(),
                request.getPhone(),
                request.getLinkedin(),
                request.getGithub(),
                request.getThemeColor() != null ? request.getThemeColor() : "#4f46e5",
                request.getFontStyle() != null ? request.getFontStyle() : "Inter",
                request.getBackgroundStyle() != null ? request.getBackgroundStyle() : "Light",
                request.getSectionSpacing() != null ? request.getSectionSpacing() : "Comfortable",
                request.getCornerStyle() != null ? request.getCornerStyle() : "Rounded",
                request.getTemplate() != null ? request.getTemplate() : "Modern",
                request.getSectionOrder());

        AiRequestDTO aiRequest = AiRequestDTO.builder()
                .model(model)
                .messages(java.util.Collections.singletonList(new AiRequestDTO.Message("user", prompt)))
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<AiRequestDTO> entity = new HttpEntity<>(aiRequest, headers);

        try {
            ResponseEntity<AiResponseDTO> response = restTemplate.postForEntity(apiUrl, entity, AiResponseDTO.class);
            AiResponseDTO responseBody = response.getBody();
            if (responseBody != null && responseBody.getChoices() != null
                    && !responseBody.getChoices().isEmpty()) {
                String content = responseBody.getChoices().get(0).getMessage().getContent().trim();
                // Clean up markdown code blocks if present (extra safety)
                if (content.startsWith("```html")) {
                    content = content.substring(7);
                } else if (content.startsWith("```")) {
                    content = content.substring(3);
                }
                if (content.endsWith("```")) {
                    content = content.substring(0, content.length() - 3);
                }

                String generatedHtml = content.trim();

                // Inject Profile Image if available
                if (request.getProfileImageBase64() != null && !request.getProfileImageBase64().isEmpty()) {
                    generatedHtml = generatedHtml.replace("{{PROFILE_IMAGE_SRC}}", request.getProfileImageBase64());
                }

                return generatedHtml;
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to generate website from AI service: " + e.getMessage());
        }

        return "Website generation failed.";
    }

    public java.util.Map<String, String> generateReactPortfolio(PortfolioRequestDTO request) {
        String prompt = PromptBuilder.buildReactPrompt(
                request.getRole(),
                request.getSkills(),
                request.getExperience(),
                request.getProjects(),
                request.getName(),
                request.getEmail(),
                request.getPhone(),
                request.getLinkedin(),
                request.getGithub(),
                request.getThemeColor() != null ? request.getThemeColor() : "#4f46e5",
                request.getFontStyle() != null ? request.getFontStyle() : "Inter",
                request.getBackgroundStyle() != null ? request.getBackgroundStyle() : "Light",
                request.getSectionSpacing() != null ? request.getSectionSpacing() : "Comfortable",
                request.getCornerStyle() != null ? request.getCornerStyle() : "Rounded",
                request.getTemplate() != null ? request.getTemplate() : "Modern",
                request.getSectionOrder());

        AiRequestDTO aiRequest = AiRequestDTO.builder()
                .model(model)
                .messages(java.util.Collections.singletonList(new AiRequestDTO.Message("user", prompt)))
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<AiRequestDTO> entity = new HttpEntity<>(aiRequest, headers);

        try {
            ResponseEntity<AiResponseDTO> response = restTemplate.postForEntity(apiUrl, entity, AiResponseDTO.class);
            AiResponseDTO responseBody = response.getBody();
            if (responseBody != null && responseBody.getChoices() != null
                    && !responseBody.getChoices().isEmpty()) {
                String content = responseBody.getChoices().get(0).getMessage().getContent().trim();

                // Cleanup JSON string
                if (content.startsWith("```json")) {
                    content = content.substring(7);
                } else if (content.startsWith("```")) {
                    content = content.substring(3);
                }
                if (content.endsWith("```")) {
                    content = content.substring(0, content.length() - 3);
                }

                return objectMapper.readValue(content.trim(),
                        new com.fasterxml.jackson.core.type.TypeReference<java.util.Map<String, String>>() {
                        });
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to generate React portfolio: " + e.getMessage());
        }
        return java.util.Collections.emptyMap();
    }

    public org.example.portfolioai.dto.AnalysisResponseDTO analyzeProfile(PortfolioRequestDTO request) {
        String prompt = PromptBuilder.buildAnalysisPrompt(
                request.getRole(),
                request.getSkills(),
                request.getExperience(),
                request.getProjects());

        AiRequestDTO aiRequest = AiRequestDTO.builder()
                .model(model)
                .messages(Collections.singletonList(new AiRequestDTO.Message("user", prompt)))
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<AiRequestDTO> entity = new HttpEntity<>(aiRequest, headers);

        try {
            ResponseEntity<AiResponseDTO> response = restTemplate.postForEntity(apiUrl, entity, AiResponseDTO.class);
            AiResponseDTO responseBody = response.getBody();
            if (responseBody != null && responseBody.getChoices() != null
                    && !responseBody.getChoices().isEmpty()) {
                String jsonResponse = responseBody.getChoices().get(0).getMessage().getContent().trim();
                // Basic cleanup if AI adds markdown
                jsonResponse = jsonResponse.replace("```json", "").replace("```", "").trim();
                return objectMapper.readValue(jsonResponse, org.example.portfolioai.dto.AnalysisResponseDTO.class);
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to analyze profile: " + e.getMessage());
        }
        return new org.example.portfolioai.dto.AnalysisResponseDTO();
    }

    public PortfolioRequestDTO parseResume(String resumeText) {
        String prompt = "Extract the following details from the resume text below and return them in strictly valid JSON format with keys: 'name', 'email', 'phone', 'linkedin', 'github', 'role', 'skills', 'experience', 'projects'.\n"
                +
                "IMPORTANT: \n" +
                "- 'skills' must be a SINGLE STRING with comma-separated values.\n" +
                "- 'experience' must be a SINGLE STRING summarizing the experience.\n" +
                "- 'projects' must be a SINGLE STRING summarizing the projects.\n" +
                "- 'name', 'email', 'phone', 'linkedin', 'github' should be extracted if available, otherwise return empty strings.\n"
                +
                "- Do NOT return JSON arrays or objects for any fields.\n" +
                "Resume Text:\n" +
                resumeText + "\n" +
                "\n" +
                "JSON Output (do not include markdown formatting):";

        AiRequestDTO aiRequest = AiRequestDTO.builder()
                .model(model)
                .messages(Collections.singletonList(new AiRequestDTO.Message("user", prompt)))
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<AiRequestDTO> entity = new HttpEntity<>(aiRequest, headers);

        try {
            ResponseEntity<AiResponseDTO> response = restTemplate.postForEntity(apiUrl, entity, AiResponseDTO.class);
            AiResponseDTO responseBody = response.getBody();
            if (responseBody != null && responseBody.getChoices() != null
                    && !responseBody.getChoices().isEmpty()) {
                String content = responseBody.getChoices().get(0).getMessage().getContent().trim();
                System.out.println("AI RAW RESPONSE: " + content);

                // Cleanup JSON string
                if (content.startsWith("```json")) {
                    content = content.substring(7);
                } else if (content.startsWith("```")) {
                    content = content.substring(3);
                }
                if (content.endsWith("```")) {
                    content = content.substring(0, content.length() - 3);
                }

                return objectMapper.readValue(content.trim(), PortfolioRequestDTO.class);
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to parse resume with AI: " + e.getMessage());
        }

        throw new RuntimeException("AI response was empty");
    }
}
