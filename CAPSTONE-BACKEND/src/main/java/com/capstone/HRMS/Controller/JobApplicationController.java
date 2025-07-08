package com.capstone.HRMS.Controller;

import com.capstone.HRMS.Service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*") // Allow your frontend to connect
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    @PostMapping("/submit")
    public ResponseEntity<String> submitApplication(
            @RequestParam String position,
            @RequestParam String email,
            @RequestParam String contact,
            @RequestParam String fullName,
            @RequestParam("file") MultipartFile file
    ) {

        List<String> allowedExtensions = Arrays.asList("pdf", "doc", "docx");

        String fileName = file.getOriginalFilename();
        String fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();

        if (!allowedExtensions.contains(fileExtension)) {
            return ResponseEntity.badRequest().body("Only PDF, DOC, and DOCX files are allowed!");
        }

        return ResponseEntity.ok("Application submitted successfully!");
    }
}
