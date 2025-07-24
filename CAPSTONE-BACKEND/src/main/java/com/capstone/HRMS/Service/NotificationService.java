package com.capstone.HRMS.Service;

import com.capstone.HRMS.Entity.Notification;
import com.capstone.HRMS.Entity.Users;
import com.capstone.HRMS.Repository.NotificationRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    private final NotificationRepo notificationRepository;

    public NotificationService(NotificationRepo notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification createNotification(Users recipient, String title, String message) {
        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setTitle(title);
        notification.setMessage(message);
        return notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsForUser(Long userId) {
        return notificationRepository.findByRecipient_UserIdOrderByTimestampDesc(userId);
    }

    public void markAsRead(Long notificationId) {
        Optional<Notification> optional = notificationRepository.findById(notificationId);
        optional.ifPresent(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
    }
}