package com.capstone.HRMS.Controller;

import com.capstone.HRMS.Entity.Notification;
import com.capstone.HRMS.Service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/{userId}")
    public List<Notification> getUserNotifications(@PathVariable Long userId) {
        return notificationService.getNotificationsForUser(userId);
    }

    @PostMapping("/mark-as-read/{id}")
    public void markNotificationAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
    }
}