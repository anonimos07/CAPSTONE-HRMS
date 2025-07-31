package com.capstone.HRMS.Repository;

import com.capstone.HRMS.Entity.JobApplication;
import com.capstone.HRMS.Entity.Notification;
import com.capstone.HRMS.Entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepo extends JpaRepository<Notification, Long> {
    boolean existsByRecipientAndJobApplication(Users recipient, JobApplication jobApplication);

    // Find all notifications for a user ordered by timestamp (newest first)
    List<Notification> findByRecipientOrderByTimestampDesc(Users recipient);

    // Find unread notifications for a user ordered by timestamp (newest first)
    List<Notification> findByRecipientAndIsReadFalseOrderByTimestampDesc(Users recipient);

    // Find all unread notifications for a user (without ordering)
    List<Notification> findByRecipientAndIsReadFalse(Users recipient);

    // Count unread notifications for a user
    Long countByRecipientAndIsReadFalse(Users recipient);

    // Delete all notifications for a user
    void deleteByRecipient(Users recipient);

    // Find notifications by job application
//    List<Notification> findByJobApplication_Id(long jobApplicationId);
}
