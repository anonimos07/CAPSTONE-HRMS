package com.capstone.HRMS.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.Duration;

@Getter
@Setter
@Entity
@Table(name = "timelog")
public class Timelog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @Column(name = "time_in")
    private LocalDateTime timeIn;

    @Column(name = "time_out")
    private LocalDateTime timeOut;

    @Column(name = "break_time_start")
    private LocalDateTime breakTimeStart;

    @Column(name = "break_time_end")
    private LocalDateTime breakTimeEnd;

    @Column(columnDefinition = "TEXT")
    private String timeInPhoto; // Base64 encoded photo

    @Column(columnDefinition = "TEXT")
    private String timeOutPhoto; // Base64 encoded photo

    @Column(name = "total_worked_hours")
    private Double totalWorkedHours;

    @Column(name = "break_duration_minutes")
    private Long breakDurationMinutes;

    // Adjustment fields for HR
    @Column(name = "adjusted_time_in")
    private LocalDateTime adjustedTimeIn;

    @Column(name = "adjusted_time_out")
    private LocalDateTime adjustedTimeOut;

    @Column(name = "adjusted_break_duration_minutes")
    private Long adjustedBreakDurationMinutes;

    @Column(name = "adjustment_reason")
    private String adjustmentReason;

    @ManyToOne
    @JoinColumn(name = "adjusted_by_user_id")
    private Users adjustedBy;

    @Column(name = "adjustment_date")
    private LocalDateTime adjustmentDate;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @Column(name = "log_date")
    private LocalDateTime logDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private TimelogStatus status = TimelogStatus.CLOCKED_OUT;

    public Timelog() {
        this.createdDate = LocalDateTime.now();
        this.updatedDate = LocalDateTime.now();
    }

    public Timelog(Users user, LocalDateTime logDate) {
        this();
        this.user = user;
        this.logDate = logDate;
    }

    // Calculate total worked hours considering breaks and adjustments
    public Double calculateTotalWorkedHours() {
        LocalDateTime effectiveTimeIn = adjustedTimeIn != null ? adjustedTimeIn : timeIn;
        LocalDateTime effectiveTimeOut = adjustedTimeOut != null ? adjustedTimeOut : timeOut;
        Long effectiveBreakDuration = adjustedBreakDurationMinutes != null ? adjustedBreakDurationMinutes : breakDurationMinutes;

        if (effectiveTimeIn == null || effectiveTimeOut == null) {
            return 0.0;
        }

        Duration workDuration = Duration.between(effectiveTimeIn, effectiveTimeOut);
        long totalMinutes = workDuration.toMinutes();

        // Subtract break time
        if (effectiveBreakDuration != null) {
            totalMinutes -= effectiveBreakDuration;
        }

        return totalMinutes / 60.0; // Convert to hours
    }

    // Update total worked hours
    public void updateTotalWorkedHours() {
        this.totalWorkedHours = calculateTotalWorkedHours();
        this.updatedDate = LocalDateTime.now();
    }

    // Calculate break duration
    public void calculateBreakDuration() {
        if (breakTimeStart != null && breakTimeEnd != null) {
            Duration breakDuration = Duration.between(breakTimeStart, breakTimeEnd);
            this.breakDurationMinutes = breakDuration.toMinutes();
        }
    }
}
