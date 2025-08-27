package com.capstone.HRMS.Controller;

import com.capstone.HRMS.Service.ProfilePictureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/profile")
@CrossOrigin(origins = "*")
public class ProfilePictureController {

    @Autowired
    private ProfilePictureService profilePictureService;

    @PostMapping("/upload-picture")
    public ResponseEntity<?> uploadProfilePicture(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401)
                    .body(Map.of("success", false, "message", "Authentication required"));
            }

            String username = authentication.getName();
            String profilePictureUrl = profilePictureService.uploadProfilePicture(username, file);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Profile picture uploaded successfully",
                "profilePictureUrl", profilePictureUrl
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/picture")
    public ResponseEntity<?> getProfilePicture(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401)
                    .body(Map.of("success", false, "message", "Authentication required"));
            }

            String username = authentication.getName();
            String profilePictureUrl = profilePictureService.getProfilePictureUrl(username);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "profilePictureUrl", profilePictureUrl
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @DeleteMapping("/picture")
    public ResponseEntity<?> resetToDefaultProfilePicture(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401)
                    .body(Map.of("success", false, "message", "Authentication required"));
            }

            String username = authentication.getName();
            profilePictureService.resetToDefaultProfilePicture(username);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Profile picture reset to default",
                "profilePictureUrl", "default-profile.png"
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
