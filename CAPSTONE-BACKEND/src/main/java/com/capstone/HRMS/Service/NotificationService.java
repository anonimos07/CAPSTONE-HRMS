package com.capstone.HRMS.Service;


import com.capstone.HRMS.Entity.Notification;
import com.capstone.HRMS.Entity.Users;
import com.capstone.HRMS.Repository.NotificationRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class NotificationService {

    private final NotificationRepo notificationRepository;


    @Async
    public void createNotification(Users recipient, String title, String message) {
        try {
            Notification notification = new Notification();
            notification.setTitle(title);
            notification.setMessage(message);
            notification.setRecipient(recipient);
            notification.setTimestamp(LocalDateTime.now());
            notification.setRead(false);

            notificationRepository.save(notification);
            log.info("Notification created for user: {}", recipient.getUserId());
        } catch (Exception e) {
            log.error("Error creating notification for user: {}", recipient.getUserId(), e);
        }
    }


    @Transactional(readOnly = true)
    public Page<Notification> getUserNotifications(Users user, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return notificationRepository.findByRecipientOrderByTimestampDesc(user, pageable);
    }


    @Transactional(readOnly = true)
    public List<Notification> getUnreadNotifications(Users user) {
        return notificationRepository.findByRecipientAndIsReadFalseOrderByTimestampDesc(user);
    }


    @Transactional(readOnly = true)
    public List<Notification> getRecentNotifications(Users user, LocalDateTime since) {
        return notificationRepository.findByRecipientAndTimestampAfter(user, since);
    }


    @Transactional(readOnly = true)
    public long getUnreadCount(Users user) {
        return notificationRepository.countByRecipientAndIsReadFalse(user);
    }


    public boolean markAsRead(Long notificationId, Users user) {
        try {
            int updated = notificationRepository.markAsRead(notificationId, user);
            return updated > 0;
        } catch (Exception e) {
            log.error("Error marking notification as read: {}", notificationId, e);
            return false;
        }
    }


    public boolean markAllAsRead(Users user) {
        try {
            int updated = notificationRepository.markAllAsRead(user);
            log.info("Marked {} notifications as read for user: {}", updated, user.getUserId());
            return true;
        } catch (Exception e) {
            log.error("Error marking all notifications as read for user: {}", user.getUserId(), e);
            return false;
        }
    }


    public boolean deleteNotification(long notificationId, Users user) {
        try {
            Optional<Notification> notification = notificationRepository.findById(notificationId);
            if (notification.isPresent() && notification.get().getRecipient().getUserId() == (user.getUserId())) {
                notificationRepository.deleteById(notificationId);
                return true;
            }
            return false;
        } catch (Exception e) {
            log.error("Error deleting notification: {}", notificationId, e);
            return false;
        }
    }

    @Scheduled(cron = "0 0 2 * * ?")
    public void cleanupOldNotifications() {
        try {
            LocalDateTime cutoffDate = LocalDateTime.now().minusDays(30); // Keep notifications for 30 days
            int deleted = notificationRepository.deleteOldNotifications(cutoffDate);
            log.info("Cleaned up {} old notifications", deleted);
        } catch (Exception e) {
            log.error("Error during notification cleanup", e);
        }
    }

    @Async
    public void createBulkNotifications(List<Users> recipients, String title, String message) {
        recipients.forEach(user -> createNotification(user, title, message));
    }
}