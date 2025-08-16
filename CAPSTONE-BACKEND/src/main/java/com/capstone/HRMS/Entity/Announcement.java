package com.capstone.HRMS.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "announcements")
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long announcementId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 2000)
    private String content;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    @JsonIgnoreProperties({"notifications", "employeeDetails", "position"})
    private Users createdBy;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Enumerated(EnumType.STRING)
    private AnnouncementPriority priority = AnnouncementPriority.NORMAL;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Announcement() {}

    public Announcement(String title, String content, Users createdBy) {
        this.title = title;
        this.content = content;
        this.createdBy = createdBy;
        this.isActive = true;
        this.priority = AnnouncementPriority.NORMAL;
    }

    public Announcement(String title, String content, Users createdBy, AnnouncementPriority priority) {
        this.title = title;
        this.content = content;
        this.createdBy = createdBy;
        this.priority = priority;
        this.isActive = true;
    }
}
