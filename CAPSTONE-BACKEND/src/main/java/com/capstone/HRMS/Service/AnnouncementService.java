package com.capstone.HRMS.Service;

import com.capstone.HRMS.Entity.Announcement;
import com.capstone.HRMS.Entity.AnnouncementPriority;
import com.capstone.HRMS.Entity.NotificationType;
import com.capstone.HRMS.Entity.Users;
import com.capstone.HRMS.Repository.AnnouncementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnnouncementService {

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Autowired
    private NotificationService notificationService;

    public Announcement createAnnouncement(String title, String content, Users createdBy) {
        Announcement announcement = new Announcement(title, content, createdBy);
        Announcement savedAnnouncement = announcementRepository.save(announcement);
        
        // Notify all users about the new announcement
        String notificationTitle = "New Announcement: " + title;
        String notificationMessage = "A new announcement has been posted by " + createdBy.getUsername();
        notificationService.notifyAllUsers(notificationTitle, notificationMessage, NotificationType.ANNOUNCEMENT);
        
        return savedAnnouncement;
    }

    public Announcement createAnnouncement(String title, String content, Users createdBy, AnnouncementPriority priority) {
        Announcement announcement = new Announcement(title, content, createdBy, priority);
        Announcement savedAnnouncement = announcementRepository.save(announcement);
        
        // Notify all users about the new announcement
        String notificationTitle = "New Announcement: " + title;
        String notificationMessage = "A new " + priority.toString().toLowerCase() + " priority announcement has been posted by " + createdBy.getUsername();
        notificationService.notifyAllUsers(notificationTitle, notificationMessage, NotificationType.ANNOUNCEMENT);
        
        return savedAnnouncement;
    }

    public List<Announcement> getAllActiveAnnouncements() {
        return announcementRepository.findByIsActiveTrueOrderByCreatedAtDesc();
    }

    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Announcement> getAnnouncementsByCreator(Users createdBy) {
        return announcementRepository.findByCreatedByOrderByCreatedAtDesc(createdBy);
    }

    public List<Announcement> getAnnouncementsByPriority(AnnouncementPriority priority) {
        return announcementRepository.findByPriorityAndIsActiveTrueOrderByCreatedAtDesc(priority);
    }

    public Optional<Announcement> getAnnouncementById(Long id) {
        return announcementRepository.findById(id);
    }

    public Announcement updateAnnouncement(Long id, String title, String content, AnnouncementPriority priority) {
        Optional<Announcement> existingAnnouncement = announcementRepository.findById(id);
        if (existingAnnouncement.isPresent()) {
            Announcement announcement = existingAnnouncement.get();
            announcement.setTitle(title);
            announcement.setContent(content);
            announcement.setPriority(priority);
            return announcementRepository.save(announcement);
        }
        return null;
    }

    public boolean deactivateAnnouncement(Long id) {
        Optional<Announcement> announcement = announcementRepository.findById(id);
        if (announcement.isPresent()) {
            announcement.get().setIsActive(false);
            announcementRepository.save(announcement.get());
            return true;
        }
        return false;
    }

    public boolean deleteAnnouncement(Long id) {
        if (announcementRepository.existsById(id)) {
            announcementRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
