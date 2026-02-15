package org.example.portfolioai.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.portfolioai.dto.PortfolioRequestDTO;
import org.example.portfolioai.dto.PortfolioResponseDTO;
import org.example.portfolioai.service.PortfolioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/portfolios")
@RequiredArgsConstructor
@Tag(name = "Portfolio Controller", description = "Endpoints for managing portfolios")
public class PortfolioController {

    private final PortfolioService portfolioService;

    @GetMapping
    @Operation(summary = "Get All Portfolios", description = "Retrieve a list of all saved portfolios")
    public ResponseEntity<List<PortfolioResponseDTO>> getAllPortfolios() {
        return ResponseEntity.ok(portfolioService.getAllPortfolios());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Portfolio by ID", description = "Retrieve a specific portfolio by its ID")
    public ResponseEntity<PortfolioResponseDTO> getPortfolioById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(portfolioService.getPortfolioById(id));
    }

    @PostMapping
    @Operation(summary = "Create Portfolio", description = "Save a new portfolio with generated bio")
    public ResponseEntity<PortfolioResponseDTO> createPortfolio(@Valid @RequestBody PortfolioRequestDTO request) {
        return new ResponseEntity<>(portfolioService.createPortfolio(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update Portfolio", description = "Update an existing portfolio")
    public ResponseEntity<PortfolioResponseDTO> updatePortfolio(
            @PathVariable("id") Long id,
            @Valid @RequestBody PortfolioRequestDTO request) {
        return ResponseEntity.ok(portfolioService.updatePortfolio(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete Portfolio", description = "Delete a portfolio by ID")
    public ResponseEntity<Void> deletePortfolio(@PathVariable("id") Long id) {
        portfolioService.deletePortfolio(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/download")
    @Operation(summary = "Download Portfolio", description = "Download the portfolio as a ZIP file")
    public ResponseEntity<Resource> downloadPortfolio(@PathVariable("id") Long id) {
        Resource resource = portfolioService.downloadPortfolio(id);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"portfolio-" + id + ".zip\"")
                .body(resource);
    }
}
