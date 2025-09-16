package com.capstone.HRMS.Service;

import com.capstone.HRMS.Entity.PasswordResetToken;
import com.capstone.HRMS.Entity.Users;
import com.capstone.HRMS.Repository.PasswordResetTokenRepository;
import com.capstone.HRMS.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class PasswordResetService {

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private UserRepo userRepository;

    @Autowired
    private EmailService emailService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final SecureRandom secureRandom = new SecureRandom();
    

    private final Map<String, LocalDateTime> lastRequestTimes = new HashMap<>();
    private static final int RATE_LIMIT_MINUTES = 1; // Allow one request per minute per identifier

    @Transactional
    public boolean initiatePasswordReset(String identifier) {

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime lastRequest = lastRequestTimes.get(identifier.toLowerCase());
        if (lastRequest != null && lastRequest.plusMinutes(RATE_LIMIT_MINUTES).isAfter(now)) {
            throw new RuntimeException("Too many password reset requests. Please wait before trying again.");
        }


        Users user = findUserByIdentifier(identifier);
        if (user == null) {

            return true;
        }


        if (user.getEmployeeDetails() == null || user.getEmployeeDetails().getEmail() == null) {
            throw new RuntimeException("No email address found for this account. Please contact HR for assistance.");
        }


        tokenRepository.invalidateUserTokens(user, now);


        String token = generateSecureToken();
        LocalDateTime expiresAt = now.plusMinutes(10); // 10-minute expiry


        PasswordResetToken resetToken = new PasswordResetToken(token, user, expiresAt);
        tokenRepository.save(resetToken);


        emailService.sendPasswordResetEmail(
            user.getEmployeeDetails().getEmail(),
            token,
            user.getEmployeeDetails().getFirstName()
        );


        lastRequestTimes.put(identifier.toLowerCase(), now);


        cleanupExpiredTokens();

        return true;
    }

    @Transactional
    public boolean resetPassword(String token, String newPassword, String confirmPassword) {

        if (!newPassword.equals(confirmPassword)) {
            throw new RuntimeException("Passwords do not match");
        }

        validatePasswordStrength(newPassword);

        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByTokenAndUsedAtIsNull(token);
        if (tokenOpt.isEmpty()) {
            throw new RuntimeException("Invalid or expired reset token");
        }

        PasswordResetToken resetToken = tokenOpt.get();

        if (resetToken.isExpired()) {
            throw new RuntimeException("Reset token has expired");
        }


        Users user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);


        resetToken.markAsUsed();
        tokenRepository.save(resetToken);


        if (user.getEmployeeDetails() != null && user.getEmployeeDetails().getEmail() != null) {
            emailService.sendPasswordChangeConfirmation(
                user.getEmployeeDetails().getEmail(),
                user.getEmployeeDetails().getFirstName()
            );
        }

        return true;
    }

    @Transactional
    public boolean changePassword(Long userId, String currentPassword, String newPassword, String confirmPassword) {

        if (!newPassword.equals(confirmPassword)) {
            throw new RuntimeException("New passwords do not match");
        }


        validatePasswordStrength(newPassword);


        Optional<Users> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        Users user = userOpt.get();

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new RuntimeException("New password must be different from current password");
        }


        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);


        if (user.getEmployeeDetails() != null && user.getEmployeeDetails().getEmail() != null) {
            emailService.sendPasswordChangeConfirmation(
                user.getEmployeeDetails().getEmail(),
                user.getEmployeeDetails().getFirstName()
            );
        }

        return true;
    }

    public boolean validateResetToken(String token) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByTokenAndUsedAtIsNull(token);
        return tokenOpt.isPresent() && !tokenOpt.get().isExpired();
    }

    private Users findUserByIdentifier(String identifier) {

        Optional<Users> userOpt = userRepository.findByUsername(identifier);
        if (userOpt.isPresent()) {
            return userOpt.get();
        }


        return userRepository.findAll().stream()
            .filter(user -> user.getEmployeeDetails() != null && 
                           user.getEmployeeDetails().getEmail() != null &&
                           user.getEmployeeDetails().getEmail().equalsIgnoreCase(identifier))
            .findFirst()
            .orElse(null);
    }

    private String generateSecureToken() {
        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }

    private void validatePasswordStrength(String password) {
        if (password == null || password.length() < 8) {
            throw new RuntimeException("Password must be at least 8 characters long");
        }
        
        boolean hasUpper = password.chars().anyMatch(Character::isUpperCase);
        boolean hasLower = password.chars().anyMatch(Character::isLowerCase);
        boolean hasDigit = password.chars().anyMatch(Character::isDigit);
        boolean hasSpecial = password.chars().anyMatch(ch -> "!@#$%^&*()_+-=[]{}|;:,.<>?".indexOf(ch) >= 0);

        if (!hasUpper || !hasLower || !hasDigit || !hasSpecial) {
            throw new RuntimeException("Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character");
        }
    }

    @Transactional
    public void cleanupExpiredTokens() {
        tokenRepository.deleteExpiredTokens(LocalDateTime.now());
    }
}
