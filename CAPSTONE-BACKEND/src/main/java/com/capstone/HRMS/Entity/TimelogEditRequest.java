package com.capstone.HRMS.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "timelog_edit_request")
public class TimelogEditRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "timelog_id", nullable = false)
    private Timelog timelog;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Users employee;

    @ManyToOne
    @JoinColumn(name = "assigned_hr_id", nullable = false)
    private Users assignedHr;

    @Column(name = "reason", columnDefinition = "TEXT", nullable = false)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private RequestStatus status = RequestStatus.PENDING;

    @Column(name = "requested_time_in")
    private LocalDateTime requestedTimeIn;

    @Column(name = "requested_time_out")
    private LocalDateTime requestedTimeOut;

    @Column(name = "requested_break_duration")
    private Long requestedBreakDuration;

    @Column(name = "hr_response")
    private String hrResponse;

    @ManyToOne
    @JoinColumn(name = "processed_by_hr_id")
    private Users processedByHr;

    @Column(name = "processed_date")
    private LocalDateTime processedDate;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    public TimelogEditRequest() {
        this.createdDate = LocalDateTime.now();
        this.updatedDate = LocalDateTime.now();
    }

    public TimelogEditRequest(Timelog timelog, Users employee, Users assignedHr, String reason) {
        this();
        this.timelog = timelog;
        this.employee = employee;
        this.assignedHr = assignedHr;
        this.reason = reason;
    }

    public enum RequestStatus {
        PENDING,
        APPROVED,
        REJECTED
    }
}
