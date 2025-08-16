package com.capstone.HRMS.Service;

import com.capstone.HRMS.Entity.Notification;
import com.capstone.HRMS.Entity.NotificationType;
import com.capstone.HRMS.Entity.Role;
import com.capstone.HRMS.Entity.Users;
import com.capstone.HRMS.Repository.NotificationRepository;
import com.capstone.HRMS.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepo userRepo;

    public Notification createNotification(Users user, String title, String message, NotificationType type) {
        Notification notification = new Notification(user, title, message, type);
        return notificationRepository.save(notification);
    }

    public Notification createNotification(Users user, String title, String message, NotificationType type, Long relatedEntityId) {
        Notification notification = new Notification(user, title, message, type, relatedEntityId);
        return notificationRepository.save(notification);
    }

    public void notifyAllUsers(String title, String message, NotificationType type) {
        List<Users> allUsers = userRepo.findAll();
        for (Users user : allUsers) {
            createNotification(user, title, message, type);
        }
    }

    public void notifyUsersByRole(Role role, String title, String message, NotificationType type) {
        List<Users> users = userRepo.findByRole(role);
        for (Users user : users) {
            createNotification(user, title, message, type);
        }
    }

    public void notifyUsersByRole(Role role, String title, String message, NotificationType type, Long relatedEntityId) {
        List<Users> users = userRepo.findByRole(role);
        for (Users user : users) {
            createNotification(user, title, message, type, relatedEntityId);
        }
    }

    public List<Notification> getNotificationsByUser(Users user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Notification> getUnreadNotificationsByUser(Users user) {
        return notificationRepository.findByUserAndIsReadOrderByCreatedAtDesc(user, false);
    }

    public Long getUnreadNotificationCount(Users user) {
        return notificationRepository.countUnreadNotificationsByUser(user);
    }

    public Notification markAsRead(Long notificationId) {
        Optional<Notification> notification = notificationRepository.findById(notificationId);
        if (notification.isPresent()) {
            notification.get().setIsRead(true);
            return notificationRepository.save(notification.get());
        }
        return null;
    }

    public void markAllAsRead(Users user) {
        List<Notification> unreadNotifications = getUnreadNotificationsByUser(user);
        for (Notification notification : unreadNotifications) {
            notification.setIsRead(true);
        }
        notificationRepository.saveAll(unreadNotifications);
    }

    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }
}
