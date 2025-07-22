package com.capstone.HRMS.Controller;

import com.capstone.HRMS.Entity.JobApplication;
import com.capstone.HRMS.Entity.Users;
import com.capstone.HRMS.Repository.JobApplicationRepo;
import com.capstone.HRMS.Repository.UserRepo;
import com.capstone.HRMS.Service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*") // Allow your frontend to connect
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    @Autowired
    private JobApplicationRepo jobApplicationRepo;

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
            // Create and save the job application
            JobApplication jobApplication = new JobApplication();
            jobApplication.setPosition(position);
            jobApplication.setEmail(email);
            jobApplication.setContact(contact);
            jobApplication.setFullName(fullName);
            jobApplication.setFile(file.getBytes()); // convert uploaded file to byte[]

            jobApplicationRepo.save(jobApplication);

            return ResponseEntity.ok("Application submitted successfully!");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to process the file.");
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

        List<JobApplication> applications = jobApplicationRepo.findAll();
        return ResponseEntity.ok(applications);
    }
}
