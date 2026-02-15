package org.example.portfolioai.service;

import org.apache.poi.xwpf.usermodel.*;
import org.example.portfolioai.dto.AnalysisResponseDTO;
import org.example.portfolioai.entity.UserEntity;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class WordGenerationService {

    public byte[] generateAnalysisReport(UserEntity user, String targetRole, AnalysisResponseDTO analysis)
            throws IOException {
        try (XWPFDocument document = new XWPFDocument();
                ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            // Title
            XWPFParagraph title = document.createParagraph();
            title.setAlignment(ParagraphAlignment.CENTER);
            XWPFRun titleRun = title.createRun();
            titleRun.setText("Profile Analysis Report");
            titleRun.setBold(true);
            titleRun.setFontSize(20);
            titleRun.setFontFamily("Calibri");
            titleRun.setColor("4F46E5"); // Indigo

            // Metadata
            createParagraph(document, "Candidate: " + user.getFullName(), true, 12);
            createParagraph(document, "Target Role: " + targetRole, true, 12);
            createParagraph(document, "Match Score: " + analysis.getMatchScore() + "%", true, 14,
                    analysis.getMatchScore() >= 80 ? "008000" : analysis.getMatchScore() >= 50 ? "FFA500" : "FF0000");

            document.createParagraph().createRun().addBreak();

            // Executive Summary
            if (analysis.getSummary() != null && !analysis.getSummary().isEmpty()) {
                createSectionTitle(document, "Executive Summary");
                createParagraph(document, analysis.getSummary(), false, 11);
                document.createParagraph().createRun().addBreak();
            }

            // Strengths
            if (analysis.getStrengths() != null && !analysis.getStrengths().isEmpty()) {
                createSectionTitle(document, "Key Strengths");
                createList(document, analysis.getStrengths());
                document.createParagraph().createRun().addBreak();
            }

            // Weaknesses
            if (analysis.getWeaknesses() != null && !analysis.getWeaknesses().isEmpty()) {
                createSectionTitle(document, "Gaps & Weaknesses");
                createList(document, analysis.getWeaknesses());
                document.createParagraph().createRun().addBreak();
            }

            // Missing Keywords
            if (analysis.getMissingKeywords() != null && !analysis.getMissingKeywords().isEmpty()) {
                createSectionTitle(document, "Missing Skills / Keywords");
                String keywords = String.join(", ", analysis.getMissingKeywords());
                createParagraph(document, keywords, false, 11);
                document.createParagraph().createRun().addBreak();
            }

            // Recommended Projects
            if (analysis.getRecommendedProjects() != null && !analysis.getRecommendedProjects().isEmpty()) {
                createSectionTitle(document, "Recommended Projects");
                createList(document, analysis.getRecommendedProjects());
                document.createParagraph().createRun().addBreak();
            }

            // Interview Questions
            if (analysis.getInterviewQuestions() != null && !analysis.getInterviewQuestions().isEmpty()) {
                createSectionTitle(document, "Interview Prep Questions");
                createList(document, analysis.getInterviewQuestions());
                document.createParagraph().createRun().addBreak();
            }

            // Improvement Tips
            if (analysis.getImprovementTips() != null && !analysis.getImprovementTips().isEmpty()) {
                createSectionTitle(document, "Actionable Improvement Tips");
                createList(document, analysis.getImprovementTips());
            }

            document.write(out);
            return out.toByteArray();
        }
    }

    private void createSectionTitle(XWPFDocument document, String text) {
        XWPFParagraph p = document.createParagraph();
        p.setStyle("Heading 1");
        // Fallback styling if style not present
        p.setBorderBottom(Borders.SINGLE);
        XWPFRun r = p.createRun();
        r.setText(text);
        r.setBold(true);
        r.setFontSize(14);
        r.setColor("2E2E2E");
    }

    private void createParagraph(XWPFDocument document, String text, boolean bold, int fontSize) {
        createParagraph(document, text, bold, fontSize, "000000");
    }

    private void createParagraph(XWPFDocument document, String text, boolean bold, int fontSize, String colorHex) {
        XWPFParagraph p = document.createParagraph();
        XWPFRun r = p.createRun();
        r.setText(text);
        r.setBold(bold);
        r.setFontSize(fontSize);
        r.setColor(colorHex);
    }

    private void createList(XWPFDocument document, List<String> items) {
        for (String item : items) {
            XWPFParagraph p = document.createParagraph();
            p.setNumID(null); // Simple bullet point equivalent
            p.setIndentationLeft(360); // Indent
            XWPFRun r = p.createRun();
            r.setText("• " + item);
            r.setFontSize(11);
        }
    }
}
