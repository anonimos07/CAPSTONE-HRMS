package com.capstone.HRMS.Repository;


import com.capstone.HRMS.Entity.Notification;
import com.capstone.HRMS.Entity.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepo extends JpaRepository<Notification, Long> {

    // Find all notifications
    List<Notification> findByRecipientOrderByTimestampDesc(Users recipient);

    // Find unread notifications
    List<Notification> findByRecipientAndIsReadFalseOrderByTimestampDesc(Users recipient);

    // Find notifications for a user
    Page<Notification> findByRecipientOrderByTimestampDesc(Users recipient, Pageable pageable);

    // Count unread notifications
    long countByRecipientAndIsReadFalse(Users recipient);

    // Find notifications created
    @Query("SELECT n FROM Notification n WHERE n.recipient = :recipient AND n.timestamp > :timestamp ORDER BY n.timestamp DESC")
    List<Notification> findByRecipientAndTimestampAfter(@Param("recipient") Users recipient, @Param("timestamp") LocalDateTime timestamp);

    // Mark notification as read
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.id = :notificationId AND n.recipient = :recipient")
    int markAsRead(@Param("notificationId") Long notificationId, @Param("recipient") Users recipient);

    // Mark all notifications as read
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.recipient = :recipient AND n.isRead = false")
    int markAllAsRead(@Param("recipient") Users recipient);

    // Delete old notifications
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.timestamp < :cutoffDate")
    int deleteOldNotifications(@Param("cutoffDate") LocalDateTime cutoffDate);
}
