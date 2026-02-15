package org.example.portfolioai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisResponseDTO {
    private Long id; // Database ID for download reference
    private Integer matchScore;
    private String summary; // New
    private List<String> strengths;
    private List<String> weaknesses;
    private List<String> missingKeywords; // New
    private List<String> recommendedProjects; // New
    private List<String> interviewQuestions; // New
    private List<String> improvementTips;
    private java.util.Map<String, Integer> sectionScores;
}
