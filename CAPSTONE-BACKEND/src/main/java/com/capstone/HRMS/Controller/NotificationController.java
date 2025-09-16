package com.capstone.HRMS.Controller;

import com.capstone.HRMS.Entity.Notification;
import com.capstone.HRMS.Entity.NotificationType;
import com.capstone.HRMS.Entity.Role;
import com.capstone.HRMS.Entity.Users;
import com.capstone.HRMS.Service.NotificationService;
import com.capstone.HRMS.Service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UsersService usersService;

    @GetMapping("/user")
    public ResponseEntity<List<Notification>> getUserNotifications(Authentication authentication) {
        try {
            String username = authentication.getName();
            Users user = usersService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            List<Notification> notifications = notificationService.getNotificationsByUser(user);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/user/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(Authentication authentication) {
        try {
            String username = authentication.getName();
            Users user = usersService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            List<Notification> notifications = notificationService.getUnreadNotificationsByUser(user);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/user/unread/count")
    public ResponseEntity<Long> getUnreadNotificationCount(Authentication authentication) {
        try {
            String username = authentication.getName();
            Users user = usersService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            Long count = notificationService.getUnreadNotificationCount(user);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long notificationId, Authentication authentication) {
        try {
            String username = authentication.getName();
            Users user = usersService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            Notification notification = notificationService.markAsRead(notificationId, user);
            if (notification == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(notification);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/user/read-all")
    public ResponseEntity<String> markAllAsRead(Authentication authentication) {
        try {
            String username = authentication.getName();
            Users user = usersService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            notificationService.markAllAsRead(user);
            return ResponseEntity.ok("All notifications marked as read");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<String> deleteNotification(@PathVariable Long notificationId, Authentication authentication) {
        try {
            String username = authentication.getName();
            Users user = usersService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            notificationService.deleteNotification(notificationId, user);
            return ResponseEntity.ok("Notification deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Notification>> getAllNotifications() {
        try {
            List<Notification> notifications = notificationService.getAllNotifications();
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PostMapping("/send/{userId}")
    public ResponseEntity<String> sendNotificationToUser(
            @PathVariable Long userId,
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            Users sender = usersService.getUserByUsername(username);
            

            if (!sender.getRole().equals(Role.HR) && !sender.getRole().equals(Role.ADMIN)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }

            Users recipient = usersService.getUserById(userId);
            if (recipient == null) {
                return ResponseEntity.notFound().build();
            }

            String title = request.get("title");
            String message = request.get("message");

            if (title == null || message == null) {
                return ResponseEntity.badRequest().body("Title and message are required");
            }

            notificationService.createNotification(recipient, title, message, NotificationType.GENERAL);
            return ResponseEntity.ok("Notification sent successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send notification");
        }
    }


    @PostMapping("/send-all")
    public ResponseEntity<String> sendNotificationToAll(
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            Users sender = usersService.getUserByUsername(username);
            

            if (!sender.getRole().equals(Role.HR) && !sender.getRole().equals(Role.ADMIN)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }

            String title = request.get("title");
            String message = request.get("message");

            if (title == null || message == null) {
                return ResponseEntity.badRequest().body("Title and message are required");
            }

            notificationService.notifyAllUsers(title, message, NotificationType.GENERAL);
            return ResponseEntity.ok("Notification sent to all users successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send notification");
        }
    }


    @PostMapping("/send-role/{role}")
    public ResponseEntity<String> sendNotificationToRole(
            @PathVariable String role,
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            Users sender = usersService.getUserByUsername(username);
            
            // Check if sender has HR or ADMIN role
            if (!sender.getRole().equals(Role.HR) && !sender.getRole().equals(Role.ADMIN)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }

            String title = request.get("title");
            String message = request.get("message");

            if (title == null || message == null) {
                return ResponseEntity.badRequest().body("Title and message are required");
            }

            notificationService.notifyUsersByRole(Role.valueOf(role.toUpperCase()), title, message, NotificationType.GENERAL);
            return ResponseEntity.ok("Notification sent to " + role + " users successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send notification");
        }
    }
}
