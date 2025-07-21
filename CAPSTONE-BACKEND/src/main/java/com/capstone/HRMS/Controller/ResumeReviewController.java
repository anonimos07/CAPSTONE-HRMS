package com.capstone.HRMS.Controller;

import com.capstone.HRMS.Service.ResumeReviewService;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/ai")
public class ResumeReviewController {

    @Autowired
    private ResumeReviewService resumeReviewService;

    // PDF only
    @PostMapping("/review-resume-file")
    public ResponseEntity<String> reviewResumeFile(@RequestParam("file") MultipartFile file) {
        try {
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Please select a file to upload");
            }

            // Check file type
            String contentType = file.getContentType();
            if (!isValidFileType(contentType)) {
                return ResponseEntity.badRequest()
                        .body("Invalid file type. Please upload PDF or TXT files only.");
            }

            // Extract text from file
            String resumeText = extractTextFromFile(file);

            if (resumeText.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Could not extract text from the file");
            }

            String review = resumeReviewService.reviewResume(resumeText);
            return ResponseEntity.ok(review);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing file: " + e.getMessage());
        }
    }

    private String extractTextFromFile(MultipartFile file) throws IOException {
        String contentType = file.getContentType();

        if ("text/plain".equals(contentType)) {
            return new String(file.getBytes(), StandardCharsets.UTF_8);
        } else if ("application/pdf".equals(contentType)) {
            return extractTextFromPdf(file);
        }

        throw new IllegalArgumentException("Unsupported file type");
    }

    private String extractTextFromPdf(MultipartFile file) throws IOException {
        try (InputStream inputStream = file.getInputStream();
             PDDocument document = PDDocument.load(inputStream)) {

            PDFTextStripper pdfStripper = new PDFTextStripper();

            // Optional: Set page range if needed
            // pdfStripper.setStartPage(1);
            // pdfStripper.setEndPage(document.getNumberOfPages());

            String text = pdfStripper.getText(document);

            // Clean up the extracted text
            return text.replaceAll("\\s+", " ").trim();

        } catch (Exception e) {
            throw new IOException("Failed to extract text from PDF: " + e.getMessage(), e);
        }
    }

    private boolean isValidFileType(String contentType) {
        return contentType != null && (
                contentType.equals("application/pdf") ||
                        contentType.equals("text/plain")
        );
    }
}