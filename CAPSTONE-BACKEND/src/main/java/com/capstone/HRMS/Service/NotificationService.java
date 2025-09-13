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
        List<Notification> notifications = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        System.out.println("DEBUG: getNotificationsByUser for userId=" + user.getUserId() + ", username=" + user.getUsername() + ", found " + notifications.size() + " notifications");
        for (Notification notif : notifications) {
            System.out.println("DEBUG: - NotificationId=" + notif.getNotificationId() + ", ownerId=" + notif.getUser().getUserId() + ", read=" + notif.getRead() + ", title=" + notif.getTitle());
        }
        return notifications;
    }

    public List<Notification> getUnreadNotificationsByUser(Users user) {
        return notificationRepository.findByUserAndReadOrderByCreatedAtDesc(user, false);
    }

    public Long getUnreadNotificationCount(Users user) {
        return notificationRepository.countUnreadNotificationsByUser(user);
    }

    public Notification markAsRead(Long notificationId, Users user) {
        System.out.println("DEBUG: markAsRead called for notificationId=" + notificationId + ", userId=" + user.getUserId() + ", username=" + user.getUsername());
        
        Optional<Notification> notification = notificationRepository.findById(notificationId);
        if (notification.isPresent()) {
            Notification notif = notification.get();
            System.out.println("DEBUG: Found notification owned by userId=" + notif.getUser().getUserId() + ", username=" + notif.getUser().getUsername());
            
            if (notif.getUser().equals(user)) {
                System.out.println("DEBUG: User matches, marking as read");
                notif.setRead(true);
                return notificationRepository.save(notif);
            } else {
                System.out.println("DEBUG: User does NOT match, access denied");
            }
        } else {
            System.out.println("DEBUG: Notification not found");
        }
        return null;
    }

    public void markAllAsRead(Users user) {
        List<Notification> unreadNotifications = getUnreadNotificationsByUser(user);
        for (Notification notification : unreadNotifications) {
            notification.setRead(true);
        }
        notificationRepository.saveAll(unreadNotifications);
    }

    public void deleteNotification(Long notificationId, Users user) {
        Optional<Notification> notification = notificationRepository.findById(notificationId);
        if (notification.isPresent() && notification.get().getUser().equals(user)) {
            notificationRepository.deleteById(notificationId);
        }
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }
}
