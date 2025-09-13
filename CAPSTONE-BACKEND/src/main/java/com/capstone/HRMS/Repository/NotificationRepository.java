package com.capstone.HRMS.Repository;

import com.capstone.HRMS.Entity.Notification;
import com.capstone.HRMS.Entity.NotificationType;
import com.capstone.HRMS.Entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByUserOrderByCreatedAtDesc(Users user);
    
    List<Notification> findByUserAndReadOrderByCreatedAtDesc(Users user, Boolean read);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user = :user AND n.read = false")
    Long countUnreadNotificationsByUser(@Param("user") Users user);
    
    List<Notification> findByTypeOrderByCreatedAtDesc(NotificationType type);
    
    List<Notification> findByUserAndTypeOrderByCreatedAtDesc(Users user, NotificationType type);
}
