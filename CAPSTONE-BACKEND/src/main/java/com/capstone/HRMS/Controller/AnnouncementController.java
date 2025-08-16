package com.capstone.HRMS.Controller;

import com.capstone.HRMS.Entity.Announcement;
import com.capstone.HRMS.Entity.AnnouncementPriority;
import com.capstone.HRMS.Entity.Role;
import com.capstone.HRMS.Entity.Users;
import com.capstone.HRMS.Service.AnnouncementService;
import com.capstone.HRMS.Service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin(origins = "*")
public class AnnouncementController {

    @Autowired
    private AnnouncementService announcementService;

    @Autowired
    private UsersService usersService;

    @PostMapping("/create")
    public ResponseEntity<?> createAnnouncement(@RequestBody Map<String, Object> request, Authentication authentication) {
        try {
            String username = authentication.getName();
            Users createdBy = usersService.getUserByUsername(username);
            if (createdBy == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            // Check if user has HR role
            if (createdBy.getRole() != Role.HR && createdBy.getRole() != Role.ADMIN) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only HR and Admin users can create announcements");
            }

            String title = request.get("title").toString();
            String content = request.get("content").toString();
            String priorityStr = request.getOrDefault("priority", "NORMAL").toString();

            AnnouncementPriority priority = AnnouncementPriority.valueOf(priorityStr.toUpperCase());
            Announcement announcement = announcementService.createAnnouncement(title, content, createdBy, priority);
            
            return ResponseEntity.ok(announcement);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error creating announcement: " + e.getMessage());
        }
    }

    @GetMapping("/active")
    public ResponseEntity<List<Announcement>> getActiveAnnouncements() {
        try {
            List<Announcement> announcements = announcementService.getAllActiveAnnouncements();
            return ResponseEntity.ok(announcements);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Announcement>> getAllAnnouncements() {
        try {
            List<Announcement> announcements = announcementService.getAllAnnouncements();
            return ResponseEntity.ok(announcements);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/user")
    public ResponseEntity<List<Announcement>> getAnnouncementsByUser(Authentication authentication) {
        try {
            String username = authentication.getName();
            Users user = usersService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            List<Announcement> announcements = announcementService.getAnnouncementsByCreator(user);
            return ResponseEntity.ok(announcements);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<Announcement>> getAnnouncementsByPriority(@PathVariable String priority) {
        try {
            AnnouncementPriority announcementPriority = AnnouncementPriority.valueOf(priority.toUpperCase());
            List<Announcement> announcements = announcementService.getAnnouncementsByPriority(announcementPriority);
            return ResponseEntity.ok(announcements);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Announcement> getAnnouncementById(@PathVariable Long id) {
        try {
            Optional<Announcement> announcement = announcementService.getAnnouncementById(id);
            if (announcement.isPresent()) {
                return ResponseEntity.ok(announcement.get());
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAnnouncement(@PathVariable Long id, @RequestBody Map<String, Object> request, Authentication authentication) {
        try {
            String username = authentication.getName();
            Users user = usersService.getUserByUsername(username);
            
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            // Check if user has HR role
            if (user.getRole() != Role.HR && user.getRole() != Role.ADMIN) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only HR and Admin users can update announcements");
            }

            String title = request.get("title").toString();
            String content = request.get("content").toString();
            String priorityStr = request.getOrDefault("priority", "NORMAL").toString();
            AnnouncementPriority priority = AnnouncementPriority.valueOf(priorityStr.toUpperCase());

            Announcement updatedAnnouncement = announcementService.updateAnnouncement(id, title, content, priority);
            if (updatedAnnouncement != null) {
                return ResponseEntity.ok(updatedAnnouncement);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error updating announcement: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateAnnouncement(@PathVariable Long id, Authentication authentication) {
        try {
            String username = authentication.getName();
            Users user = usersService.getUserByUsername(username);
            
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            // Check if user has HR role
            if (user.getRole() != Role.HR && user.getRole() != Role.ADMIN) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only HR and Admin users can deactivate announcements");
            }

            boolean success = announcementService.deactivateAnnouncement(id);
            if (success) {
                return ResponseEntity.ok("Announcement deactivated successfully");
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error deactivating announcement: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnnouncement(@PathVariable Long id, Authentication authentication) {
        try {
            String username = authentication.getName();
            Users user = usersService.getUserByUsername(username);
            
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }

            // Check if user has HR role
            if (user.getRole() != Role.HR && user.getRole() != Role.ADMIN) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only HR and Admin users can delete announcements");
            }

            boolean success = announcementService.deleteAnnouncement(id);
            if (success) {
                return ResponseEntity.ok("Announcement deleted successfully");
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error deleting announcement: " + e.getMessage());
        }
    }
}
