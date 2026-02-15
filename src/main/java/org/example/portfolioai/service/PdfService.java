package org.example.portfolioai.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class PdfService {

    public String extractTextFromPdf(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("Uploaded file is empty");
        }

        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            System.out.println("DEBUG: Extracted text from PDF: " + text);
            return text;
        } catch (IOException e) {
            System.err.println("ERROR: Failed to extract text from PDF: " + e.getMessage());
            throw new RuntimeException("Failed to extract text from PDF: " + e.getMessage(), e);
        }
    }
}
