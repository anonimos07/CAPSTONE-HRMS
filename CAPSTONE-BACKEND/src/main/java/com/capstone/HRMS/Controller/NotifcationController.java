package com.capstone.HRMS.Controller;

import com.capstone.HRMS.DTO.JobApplicationDTO;
import com.capstone.HRMS.DTO.NotificationRequest;
import com.capstone.HRMS.Entity.JobApplication;
import com.capstone.HRMS.Entity.Notification;
import com.capstone.HRMS.Entity.Users;
import com.capstone.HRMS.Repository.JobApplicationRepo;
import com.capstone.HRMS.Repository.NotificationRepo;
import com.capstone.HRMS.Repository.UserRepo;
import com.capstone.HRMS.Service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/notifications")
public class NotifcationController {

    private final NotificationService notificationService;

    @Autowired
    private JobApplicationRepo jobApplicationRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private NotificationRepo notificationRepo;

    @Transactional(readOnly = true)
    @GetMapping("/application")
    public ResponseEntity<?> getHRNotifications(Authentication authentication) {
        try {
            String username = authentication.getName();
            Users currentUser = userRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (!currentUser.getPosition().getTitle().equalsIgnoreCase("HR-Supervisor")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Access denied: Not an HR-Supervisor");
            }

            List<Notification> notifications = notificationRepo.findByRecipientOrderByTimestampDesc(currentUser);

            // Convert to DTOs
            List<NotificationRequest> notificationDTOs = notifications.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(notificationDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving notifications: " + e.getMessage());
        }
    }

    // Get all notifications for the current user
    @GetMapping("/user")
    public ResponseEntity<List<Notification>> getNotificationsByUser(Authentication authentication) {
        try {
            String username = authentication.getName();
            Users currentUser = userRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Notification> notifications = notificationRepo.findByRecipientOrderByTimestampDesc(currentUser);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get all unread notifications for the current user
    @GetMapping("/user/unread")
    public ResponseEntity<List<Notification>> getUnreadNotificationsByUser(Authentication authentication) {
        try {
            String username = authentication.getName();
            Users currentUser = userRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Notification> notifications = notificationRepo.findByRecipientAndIsReadFalseOrderByTimestampDesc(currentUser);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get unread notification count for the current user
    @GetMapping("/user/unread/count")
    public ResponseEntity<Long> getUnreadNotificationCount(Authentication authentication) {
        try {
            String username = authentication.getName();
            Users currentUser = userRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Long count = notificationRepo.countByRecipientAndIsReadFalse(currentUser);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }



    // Mark a notification as read
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long notificationId, Authentication authentication) {
        try {
            String username = authentication.getName();
            Users currentUser = userRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Optional<Notification> notificationOpt = notificationRepo.findById(notificationId);
            if (notificationOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // Verify the notification belongs to the current user
            Notification notification = notificationOpt.get();
            if (!notification.getRecipient().equals(currentUser)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            notification.setRead(true);
            Notification updatedNotification = notificationRepo.save(notification);

            return ResponseEntity.ok(updatedNotification);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Mark a notification as unread
    @PutMapping("/{notificationId}/unread")
    public ResponseEntity<Notification> markAsUnread(@PathVariable Long notificationId, Authentication authentication) {
        try {
            String username = authentication.getName();
            Users currentUser = userRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Optional<Notification> notificationOpt = notificationRepo.findById(notificationId);
            if (notificationOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // Verify the notification belongs to the current user
            Notification notification = notificationOpt.get();
            if (!notification.getRecipient().equals(currentUser)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            notification.setRead(false);
            Notification updatedNotification = notificationRepo.save(notification);

            return ResponseEntity.ok(updatedNotification);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Mark all notifications as read for the current user
    @PutMapping("/user/read-all")
    public ResponseEntity<String> markAllAsRead(Authentication authentication) {
        try {
            String username = authentication.getName();
            Users currentUser = userRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Notification> unreadNotifications = notificationRepo.findByRecipientAndIsReadFalse(currentUser);
            for (Notification notification : unreadNotifications) {
                notification.setRead(true);
            }
            notificationRepo.saveAll(unreadNotifications);

            return ResponseEntity.ok("All notifications marked as read");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Delete a notification
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<String> deleteNotification(@PathVariable Long notificationId, Authentication authentication) {
        try {
            String username = authentication.getName();
            Users currentUser = userRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Optional<Notification> notification = notificationRepo.findById(notificationId);
            if (notification.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // Verify the notification belongs to the current user
            if (!notification.get().getRecipient().equals(currentUser)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            notificationRepo.deleteById(notificationId);
            return ResponseEntity.ok("Notification deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Delete all notifications for the current user
    @DeleteMapping("/user")
    public ResponseEntity<String> deleteAllNotificationsForUser(Authentication authentication) {
        try {
            String username = authentication.getName();
            Users currentUser = userRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            notificationRepo.deleteByRecipient(currentUser);
            return ResponseEntity.ok("All notifications deleted for user");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get a specific notification by ID
    @GetMapping("/{notificationId}")
    public ResponseEntity<Notification> getNotificationById(@PathVariable Long notificationId, Authentication authentication) {
        try {
            String username = authentication.getName();
            Users currentUser = userRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Optional<Notification> notification = notificationRepo.findById(notificationId);
            if (notification.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // Verify the notification belongs to the current user
            if (!notification.get().getRecipient().equals(currentUser)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            return ResponseEntity.ok(notification.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    //DTO
    private NotificationRequest convertToDTO(Notification notification) {
        NotificationRequest dto = new NotificationRequest();
        dto.setRecipientId(notification.getId());
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setTimestamp(notification.getTimestamp());
        dto.setRead(notification.isRead());

        if (notification.getJobApplication() != null) {
            JobApplicationDTO appDto = new JobApplicationDTO();
            appDto.setId(notification.getJobApplication().getJobApplicationId());
            appDto.setPosition(notification.getJobApplication().getPosition());
            appDto.setEmail(notification.getJobApplication().getEmail());
            appDto.setContact(notification.getJobApplication().getContact());
            appDto.setFullName(notification.getJobApplication().getFullName());
            dto.setJobApplication(appDto);
        }

        return dto;
    }
}