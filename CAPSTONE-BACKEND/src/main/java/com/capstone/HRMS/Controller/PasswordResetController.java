package com.capstone.HRMS.Controller;

import com.capstone.HRMS.Service.PasswordResetService;
import com.capstone.HRMS.Service.UsersService;
import com.capstone.HRMS.Entity.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class PasswordResetController {

    @Autowired
    private PasswordResetService passwordResetService;

    @Autowired
    private UsersService usersService;

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String identifier = request.get("identifier");
            
            if (identifier == null || identifier.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Email or username is required"));
            }

            passwordResetService.initiatePasswordReset(identifier.trim());
            
            return ResponseEntity.ok(Map.of(
                "success", true, 
                "message", "If an account with that email/username exists, a password reset link has been sent."
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            System.out.println("Reset password request received: " + request);
            String token = request.get("token");
            String newPassword = request.get("newPassword");
            String confirmPassword = request.get("confirmPassword");
            
            System.out.println("Token: " + token);
            System.out.println("NewPassword length: " + (newPassword != null ? newPassword.length() : "null"));
            System.out.println("ConfirmPassword length: " + (confirmPassword != null ? confirmPassword.length() : "null"));
            
            if (token == null || token.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Reset token is required"));
            }
            
            if (newPassword == null || newPassword.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "New password is required"));
            }
            
            if (confirmPassword == null || confirmPassword.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Password confirmation is required"));
            }

            passwordResetService.resetPassword(token.trim(), newPassword, confirmPassword);
            
            return ResponseEntity.ok(Map.of(
                "success", true, 
                "message", "Password has been reset successfully. You can now log in with your new password."
            ));
            
        } catch (Exception e) {
            System.out.println("Reset password error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401)
                    .body(Map.of("success", false, "message", "Authentication required"));
            }

            String username = authentication.getName();
            String currentPassword = request.get("currentPassword");
            String newPassword = request.get("newPassword");
            String confirmPassword = request.get("confirmPassword");
            
            if (currentPassword == null || currentPassword.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Current password is required"));
            }
            
            if (newPassword == null || newPassword.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "New password is required"));
            }
            
            if (confirmPassword == null || confirmPassword.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Password confirmation is required"));
            }


            Long userId = getUserIdFromUsername(username);
            
            passwordResetService.changePassword(userId, currentPassword, newPassword, confirmPassword);
            
            return ResponseEntity.ok(Map.of(
                "success", true, 
                "message", "Password has been changed successfully."
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/validate-reset-token")
    public ResponseEntity<?> validateResetToken(@RequestParam String token) {
        try {
            boolean isValid = passwordResetService.validateResetToken(token);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "valid", isValid,
                "message", isValid ? "Token is valid" : "Token is invalid or expired"
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    private Long getUserIdFromUsername(String username) {
        Users user = usersService.getUserByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        return user.getUserId();
    }
}
