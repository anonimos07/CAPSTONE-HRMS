package com.capstone.HRMS.Repository;

import com.capstone.HRMS.Entity.Announcement;
import com.capstone.HRMS.Entity.AnnouncementPriority;
import com.capstone.HRMS.Entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    
    List<Announcement> findByIsActiveTrueOrderByCreatedAtDesc();
    
    List<Announcement> findByCreatedByOrderByCreatedAtDesc(Users createdBy);
    
    List<Announcement> findByPriorityAndIsActiveTrueOrderByCreatedAtDesc(AnnouncementPriority priority);
    
    List<Announcement> findAllByOrderByCreatedAtDesc();
}
