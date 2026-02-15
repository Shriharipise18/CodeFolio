package org.example.portfolioai.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.portfolioai.dto.PortfolioRequestDTO;
import org.example.portfolioai.service.AiGenerationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "AI Controller", description = "Endpoints for AI generation")
public class AiController {

    private final AiGenerationService aiGenerationService;
    private final org.example.portfolioai.service.PdfService pdfService;

    @PostMapping("/generate-bio")
    @Operation(summary = "Generate Bio", description = "Generates a professional bio based on portfolio details")
    public ResponseEntity<Map<String, String>> generateBio(@Valid @RequestBody PortfolioRequestDTO request) {
        String bio = aiGenerationService.generateBio(request);
        return ResponseEntity.ok(java.util.Collections.singletonMap("bio", bio));
    }

    @PostMapping("/generate-website")
    @Operation(summary = "Generate Website", description = "Generates a single-page HTML porfolio website based on details")
    public ResponseEntity<Map<String, String>> generateWebsite(@Valid @RequestBody PortfolioRequestDTO request) {
        String html = aiGenerationService.generateWebsite(request);
        return ResponseEntity.ok(java.util.Collections.singletonMap("html", html));
    }

    @PostMapping("/analyze-profile")
    @Operation(summary = "Analyze Profile", description = "Analyzes the portfolio against the target role and provides scores and tips")
    public ResponseEntity<org.example.portfolioai.dto.AnalysisResponseDTO> analyzeProfile(
            @Valid @RequestBody PortfolioRequestDTO request) {
        return ResponseEntity.ok(aiGenerationService.analyzeProfile(request));
    }

    @PostMapping(value = "/parse-resume", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Parse Resume", description = "Extracts details from an uploaded PDF resume")
    public ResponseEntity<PortfolioRequestDTO> parseResume(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        String text = pdfService.extractTextFromPdf(file);
        return ResponseEntity.ok(aiGenerationService.parseResume(text));
    }

    @PostMapping("/download-react")
    @Operation(summary = "Download React Portfolio", description = "Generates and returns a ZIP file of a React portfolio project")
    public ResponseEntity<org.springframework.core.io.Resource> downloadReactPortfolio(
            @Valid @RequestBody PortfolioRequestDTO request) {
        java.util.Map<String, String> files = aiGenerationService.generateReactPortfolio(request);

        try (java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream();
                java.util.zip.ZipOutputStream zos = new java.util.zip.ZipOutputStream(baos)) {

            for (java.util.Map.Entry<String, String> entry : files.entrySet()) {
                java.util.zip.ZipEntry zipEntry = new java.util.zip.ZipEntry(entry.getKey());
                zos.putNextEntry(zipEntry);
                zos.write(entry.getValue().getBytes());
                zos.closeEntry();
            }
            zos.finish();

            org.springframework.core.io.ByteArrayResource resource = new org.springframework.core.io.ByteArrayResource(
                    baos.toByteArray());

            return ResponseEntity.ok()
                    .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"portfolio-react.zip\"")
                    .contentType(org.springframework.http.MediaType.APPLICATION_OCTET_STREAM)
                    .body(resource);

        } catch (java.io.IOException e) {
            throw new RuntimeException("Failed to zip React portfolio", e);
        }
    }
}
