package com.capstone.HRMS.Repository;

import com.capstone.HRMS.Entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepo extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipient_UserIdOrderByTimestampDesc(long userId);

}
