package com.capstone.HRMS.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public void sendPasswordResetEmail(String toEmail, String token, String firstName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Password Reset Request - HRMS");
            
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
            
            message.setText(emailBody);
            mailSender.send(message);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }

    public void sendPasswordChangeConfirmation(String toEmail, String firstName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Password Changed Successfully - HRMS");
            
            String emailBody = String.format(
                "Dear %s,\n\n" +
                "Your password has been successfully changed for your HRMS account.\n\n" +
                "If you did not make this change, please contact your HR administrator immediately.\n\n" +
                "Best regards,\n" +
                "HRMS Team",
                firstName != null ? firstName : "User"
            );
            
            message.setText(emailBody);
            mailSender.send(message);
            
        } catch (Exception e) {

            System.err.println("Failed to send password change confirmation email: " + e.getMessage());
        }
    }
}
