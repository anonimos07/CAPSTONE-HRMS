package com.capstone.HRMS.Controller;

import com.capstone.HRMS.Entity.JobApplication;
import com.capstone.HRMS.Entity.Users;
import com.capstone.HRMS.Repository.UserRepo;
import com.capstone.HRMS.Service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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


    @Autowired
    private UserRepo userRepo;

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

        try {
            // Use the service to submit the application
            jobApplicationService.submitApplication(position, email, contact, fullName, file);
            return ResponseEntity.ok("Application submitted successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to process the application: " + e.getMessage());
        }
    }


    @GetMapping("/application")
    public ResponseEntity<?> getAllApplications(Authentication authentication) {
        String username = authentication.getName();
        Users currentUser = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!currentUser.getPosition().getTitle().equalsIgnoreCase("HR-Supervisor")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: Not an HR-Supervisor");
        }

        List<JobApplication> applications = jobApplicationService.getAllApplications();
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getApplicationById(@PathVariable Long id, Authentication authentication) {
        try {
            String username = authentication.getName();
            Users currentUser = userRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (currentUser.getRole() != com.capstone.HRMS.Entity.Role.HR && 
                currentUser.getRole() != com.capstone.HRMS.Entity.Role.ADMIN) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: HR role required");
            }

            return jobApplicationService.getApplicationById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateApplicationStatus(@PathVariable Long id, 
                                                   @RequestBody java.util.Map<String, String> request,
                                                   Authentication authentication) {
        try {
            String username = authentication.getName();
            Users currentUser = userRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (currentUser.getRole() != com.capstone.HRMS.Entity.Role.HR && 
                currentUser.getRole() != com.capstone.HRMS.Entity.Role.ADMIN) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: HR role required");
            }

            String statusStr = request.get("status");
            String reviewNotes = request.getOrDefault("reviewNotes", "");
            
            com.capstone.HRMS.Entity.ApplicationStatus status = 
                com.capstone.HRMS.Entity.ApplicationStatus.valueOf(statusStr.toUpperCase());

            JobApplication updatedApplication = jobApplicationService.updateApplicationStatus(id, status, reviewNotes);
            if (updatedApplication != null) {
                return ResponseEntity.ok(updatedApplication);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadResume(@PathVariable Long id, Authentication authentication) {
        try {
            String username = authentication.getName();
            Users currentUser = userRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (currentUser.getRole() != com.capstone.HRMS.Entity.Role.HR && 
                currentUser.getRole() != com.capstone.HRMS.Entity.Role.ADMIN) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            Resource resource = jobApplicationService.downloadResume(id);
            if (resource == null) {
                return ResponseEntity.notFound().build();
            }

            // Get the application to determine the original filename
            JobApplication application = jobApplicationService.getApplicationById(id).orElse(null);
            String filename = application != null ? application.getFileName() : "resume.pdf";

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
