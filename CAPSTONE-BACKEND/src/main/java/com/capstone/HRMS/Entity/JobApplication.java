package com.capstone.HRMS.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter@Setter
@Entity
@RequiredArgsConstructor
@Table(name = "job_applications")
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long jobApplicationId;

    @Column(nullable = false)
    private String position;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String contact;

    @Column(nullable = false)
    private String fullName;

    @Lob
    private byte[] file;

    @Column
    private String fileName;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status = ApplicationStatus.PENDING;

    @Column(nullable = false)
    private LocalDateTime submittedAt;

    @Column
    private LocalDateTime reviewedAt;

    @Column
    private String reviewNotes;

    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
    }

    public JobApplication(String position, String email, String contact, String fullName, byte[] file, String fileName) {
        this.position = position;
        this.email = email;
        this.contact = contact;
        this.fullName = fullName;
        this.file = file;
        this.fileName = fileName;
        this.status = ApplicationStatus.PENDING;
    }
}
