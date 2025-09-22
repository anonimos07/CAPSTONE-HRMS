package com.capstone.HRMS.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

@Service
public class EmailService {

    @Value("${brevo.api.url}")
    private String brevoApiUrl;

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    @Value("${spring.mail.from}")
    private String fromEmail;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public void sendPasswordResetEmail(String toEmail, String token, String firstName) {
        try {
            System.out.println("DEBUG: Attempting to send password reset email to: " + toEmail);
            System.out.println("DEBUG: From email configured as: " + fromEmail);
            System.out.println("DEBUG: Frontend URL: " + frontendUrl);
            System.out.println("DEBUG: Using Brevo HTTP API");
            
            String resetLink = frontendUrl + "/reset-password?token=" + token;
            
            String emailBody = String.format(
                "Dear %s,\n\n" +
                "You have requested to reset your password for your HRMS account.\n\n" +
                "Please click the link below to reset your password:\n" +
                "%s\n\n" +
                "This link will expire in 10 minutes for security reasons.\n\n" +
                "If you did not request this password reset, please ignore this email.\n\n" +
                "Best regards,\n" +
                "HRMS Team",
                firstName != null ? firstName : "User",
                resetLink
            );
            
            sendBrevoEmail(toEmail, "Password Reset Request - HRMS", emailBody);
            System.out.println("DEBUG: Email sent successfully via Brevo API!");
            
        } catch (Exception e) {
            System.err.println("ERROR: Failed to send email - " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }

    public void sendPasswordChangeConfirmation(String toEmail, String firstName) {
        try {
            String emailBody = String.format(
                "Dear %s,\n\n" +
                "Your password has been successfully changed for your HRMS account.\n\n" +
                "If you did not make this change, please contact your HR administrator immediately.\n\n" +
                "Best regards,\n" +
                "HRMS Team",
                firstName != null ? firstName : "User"
            );
            
            sendBrevoEmail(toEmail, "Password Changed Successfully - HRMS", emailBody);
            
        } catch (Exception e) {
            System.err.println("Failed to send password change confirmation email: " + e.getMessage());
        }
    }

    private void sendBrevoEmail(String toEmail, String subject, String content) {
        try {
            System.out.println("DEBUG: Sending email via Brevo API to: " + toEmail);
            System.out.println("DEBUG: API URL: " + brevoApiUrl);
            
            // Create headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", brevoApiKey);
            
            // Create email payload
            Map<String, Object> emailPayload = new HashMap<>();
            
            // Sender
            Map<String, String> sender = new HashMap<>();
            sender.put("email", fromEmail);
            sender.put("name", "HRMS Team");
            emailPayload.put("sender", sender);
            
            // Recipients
            List<Map<String, String>> recipients = new ArrayList<>();
            Map<String, String> recipient = new HashMap<>();
            recipient.put("email", toEmail);
            recipients.add(recipient);
            emailPayload.put("to", recipients);
            
            // Subject and content
            emailPayload.put("subject", subject);
            emailPayload.put("textContent", content);
            
            // Create HTTP entity
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(emailPayload, headers);
            
            // Send request
            ResponseEntity<String> response = restTemplate.exchange(
                brevoApiUrl,
                HttpMethod.POST,
                entity,
                String.class
            );
            
            System.out.println("DEBUG: Brevo API response status: " + response.getStatusCode());
            System.out.println("DEBUG: Brevo API response body: " + response.getBody());
            
        } catch (Exception e) {
            System.err.println("ERROR: Failed to send email via Brevo API - " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to send email via Brevo API", e);
        }
    }
}
