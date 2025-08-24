package com.capstone.HRMS.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@Entity
@Table(name = "leave_balance")
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    @JsonBackReference
    private Users employee;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LeaveType leaveType;

    @Column(nullable = false)
    private Integer totalDays = 0;

    @Column(nullable = false)
    private Integer usedDays = 0;

    @Column(nullable = false)
    private Integer remainingDays = 0;

    @Column(nullable = false)
    private Integer year;

    public LeaveBalance() {}

    public LeaveBalance(Users employee, LeaveType leaveType, Integer totalDays, Integer year) {
        this.employee = employee;
        this.leaveType = leaveType;
        this.totalDays = totalDays;
        this.usedDays = 0;
        this.remainingDays = totalDays;
        this.year = year;
    }

    public void updateUsedDays(Integer days) {
        this.usedDays += days;
        this.remainingDays = this.totalDays - this.usedDays;
    }

    public boolean hasEnoughBalance(Integer requestedDays) {
        return this.remainingDays >= requestedDays;
    }
}
