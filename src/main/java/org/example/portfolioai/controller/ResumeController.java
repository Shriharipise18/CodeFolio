package org.example.portfolioai.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.example.portfolioai.dto.PortfolioRequestDTO;
import org.example.portfolioai.service.AiGenerationService;
import org.example.portfolioai.service.PdfParsingService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.example.portfolioai.dto.AnalysisResponseDTO;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/resume")
@Tag(name = "Resume Controller", description = "Endpoints for parsing resumes")
public class ResumeController {

    private final org.example.portfolioai.service.PdfParsingService pdfParsingService;
    private final org.example.portfolioai.service.AiGenerationService aiGenerationService;
    private final org.example.portfolioai.service.AuthService authService;
    private final org.example.portfolioai.repository.AnalysisRepository analysisRepository;
    private final org.example.portfolioai.service.WordGenerationService wordGenerationService;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;
    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(ResumeController.class);

    public ResumeController(org.example.portfolioai.service.PdfParsingService pdfParsingService,
            org.example.portfolioai.service.AiGenerationService aiGenerationService,
            org.example.portfolioai.service.AuthService authService,
            org.example.portfolioai.repository.AnalysisRepository analysisRepository,
            org.example.portfolioai.service.WordGenerationService wordGenerationService,
            com.fasterxml.jackson.databind.ObjectMapper objectMapper) {
        this.pdfParsingService = pdfParsingService;
        this.aiGenerationService = aiGenerationService;
        this.authService = authService;
        this.analysisRepository = analysisRepository;
        this.wordGenerationService = wordGenerationService;
        this.objectMapper = objectMapper;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Parse Resume", description = "Upload a PDF resume to extract portfolio details")
    public ResponseEntity<PortfolioRequestDTO> parseResume(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        String resumeText = pdfParsingService.extractText(file);
        PortfolioRequestDTO extractedData = aiGenerationService.parseResume(resumeText);

        return ResponseEntity.ok(extractedData);
    }

    @PostMapping(value = "/upload-to-profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload and Save to Profile", description = "Upload a PDF resume, extract details, and save to user profile")
    public ResponseEntity<?> uploadToProfile(@RequestParam("file") MultipartFile file,
            java.security.Principal principal) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        logger.info("Received resume upload from user: {}", principal.getName());
        logger.info("File size: {}", file.getSize());

        String resumeText = pdfParsingService.extractText(file);
        logger.info("Extracted text length: {}", resumeText.length());

        if (resumeText.trim().isEmpty()) {
            logger.warn("Extracted text is empty. PDF might be image-based or empty.");
            return ResponseEntity.badRequest().body(java.util.Collections.singletonMap("error",
                    "The uploaded PDF contains no extractable text. It might be an image or scanned document. Please upload a text-based PDF."));
        } else {
            logger.info("Extracted Text Preview: {}", resumeText.substring(0, Math.min(resumeText.length(), 100)));
        }

        PortfolioRequestDTO extractedData = aiGenerationService.parseResume(resumeText);

        authService.updateResumeData(principal.getName(), extractedData);

        return ResponseEntity.ok(extractedData);
    }

    @PostMapping(value = "/analyze")
    @Operation(summary = "Analyze Profile", description = "Analyze resume fit for target role")
    public ResponseEntity<AnalysisResponseDTO> analyzeProfile(@RequestBody PortfolioRequestDTO request,
            java.security.Principal principal) {
        try {
            // 1. Get User
            String email = principal.getName();
            org.example.portfolioai.entity.UserEntity user = authService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // 2. Enhance Request with User Profile Data if missing in request
            PortfolioRequestDTO updatedRequest = new PortfolioRequestDTO();
            updatedRequest.setRole(request.getRole());
            // Use correct getter getGeneratedBio() for bio field in DTO
            updatedRequest
                    .setGeneratedBio(request.getGeneratedBio() != null ? request.getGeneratedBio() : user.getBio());
            updatedRequest.setSkills(request.getSkills() != null ? request.getSkills() : user.getSkills());
            updatedRequest
                    .setExperience(request.getExperience() != null ? request.getExperience() : user.getExperience());
            updatedRequest.setProjects(request.getProjects() != null ? request.getProjects() : user.getProjects());

            // 3. Analyze
            AnalysisResponseDTO analysis = aiGenerationService.analyzeProfile(updatedRequest);

            // 4. Save Analysis to DB
            try {
                String jsonContent = objectMapper.writeValueAsString(analysis);
                org.example.portfolioai.entity.AnalysisEntity entity = org.example.portfolioai.entity.AnalysisEntity
                        .builder()
                        .user(user)
                        .targetRole(request.getRole())
                        .matchScore(analysis.getMatchScore())
                        .rawJsonContent(jsonContent)
                        .build();

                entity = analysisRepository.save(entity);
                analysis.setId(entity.getId()); // Set ID for frontend to use in download link
            } catch (Exception e) {
                e.printStackTrace();
                logger.error("Failed to save analysis result", e);
            }

            return ResponseEntity.ok(analysis);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(new AnalysisResponseDTO());
        }
    }

    @org.springframework.web.bind.annotation.GetMapping("/last-analysis")
    @Operation(summary = "Get Last Analysis", description = "Retrieve the most recent analysis result for the user")
    public ResponseEntity<AnalysisResponseDTO> getLastAnalysis(java.security.Principal principal) {
        try {
            String email = principal.getName();
            org.example.portfolioai.entity.UserEntity user = authService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            java.util.List<org.example.portfolioai.entity.AnalysisEntity> history = analysisRepository
                    .findByUserIdOrderByCreatedAtDesc(user.getId());

            if (history.isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            org.example.portfolioai.entity.AnalysisEntity latest = history.get(0);
            AnalysisResponseDTO analysis = objectMapper.readValue(latest.getRawJsonContent(),
                    AnalysisResponseDTO.class);
            analysis.setId(latest.getId());

            return ResponseEntity.ok(analysis);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @org.springframework.web.bind.annotation.GetMapping("/analyze/{id}/download")
    public ResponseEntity<byte[]> downloadAnalysis(@org.springframework.web.bind.annotation.PathVariable Long id) {
        try {
            org.example.portfolioai.entity.AnalysisEntity entity = analysisRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Analysis not found"));

            AnalysisResponseDTO analysis = objectMapper.readValue(entity.getRawJsonContent(),
                    AnalysisResponseDTO.class);

            byte[] docxBytes = wordGenerationService.generateAnalysisReport(entity.getUser(), entity.getTargetRole(),
                    analysis);

            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "Analysis_Report.docx");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(docxBytes);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
