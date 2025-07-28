package com.capstone.HRMS.Controller;


import com.capstone.HRMS.Entity.Notification;
import com.capstone.HRMS.Entity.Users;
import com.capstone.HRMS.Service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*") // Configure according to your frontend URL
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getUserNotifications(
            @AuthenticationPrincipal Users currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        try {
            Page<Notification> notifications = notificationService.getUserNotifications(currentUser, page, size);

            Map<String, Object> response = new HashMap<>();
            response.put("notifications", notifications.getContent());
            response.put("currentPage", notifications.getNumber());
            response.put("totalItems", notifications.getTotalElements());
            response.put("totalPages", notifications.getTotalPages());
            response.put("hasNext", notifications.hasNext());
            response.put("hasPrevious", notifications.hasPrevious());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching notifications for user: {}", currentUser.getUserId(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@AuthenticationPrincipal Users currentUser) {
        try {
            long count = notificationService.getUnreadCount(currentUser);
            Map<String, Long> response = new HashMap<>();
            response.put("unreadCount", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching unread count for user: {}", currentUser.getUserId(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(@AuthenticationPrincipal Users currentUser) {
        try {
            List<Notification> notifications = notificationService.getUnreadNotifications(currentUser);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            log.error("Error fetching unread notifications for user: {}", currentUser.getUserId(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/recent")
    public ResponseEntity<Map<String, Object>> getRecentNotifications(
            @AuthenticationPrincipal Users currentUser,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime since) {

        try {
            List<Notification> recentNotifications = notificationService.getRecentNotifications(currentUser, since);
            long unreadCount = notificationService.getUnreadCount(currentUser);

            Map<String, Object> response = new HashMap<>();
            response.put("notifications", recentNotifications);
            response.put("unreadCount", unreadCount);
            response.put("timestamp", LocalDateTime.now());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching recent notifications for user: {}", currentUser.getUserId(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Map<String, Object>> markAsRead(
            @PathVariable Long notificationId,
            @AuthenticationPrincipal Users currentUser) {

        try {
            boolean success = notificationService.markAsRead(notificationId, currentUser);
            Map<String, Object> response = new HashMap<>();
            response.put("success", success);

            if (success) {
                response.put("message", "Notification marked as read");
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Notification not found or already read");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            log.error("Error marking notification as read: {}", notificationId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/read-all")
    public ResponseEntity<Map<String, Object>> markAllAsRead(@AuthenticationPrincipal Users currentUser) {
        try {
            boolean success = notificationService.markAllAsRead(currentUser);
            Map<String, Object> response = new HashMap<>();
            response.put("success", success);
            response.put("message", success ? "All notifications marked as read" : "Failed to mark notifications as read");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error marking all notifications as read for user: {}", currentUser.getUserId(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Map<String, Object>> deleteNotification(
            @PathVariable Long notificationId,
            @AuthenticationPrincipal Users currentUser) {

        try {
            boolean success = notificationService.deleteNotification(notificationId, currentUser);
            Map<String, Object> response = new HashMap<>();
            response.put("success", success);
            response.put("message", success ? "Notification deleted" : "Notification not found");

            return success ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            log.error("Error deleting notification: {}", notificationId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/test")
    public ResponseEntity<Map<String, String>> createTestNotification(@AuthenticationPrincipal Users currentUser) {
        try {
            notificationService.createNotification(
                    currentUser,
                    "Test Notification",
                    "This is a test notification created at " + LocalDateTime.now()
            );

            Map<String, String> response = new HashMap<>();
            response.put("message", "Test notification created");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error creating test notification", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}