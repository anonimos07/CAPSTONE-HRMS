package com.capstone.HRMS.DTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter@Setter
public class NotificationRequest {
    private String title;
    private String message;
    private Long recipientId;
    private boolean isRead = true;
    private LocalDateTime timestamp = LocalDateTime.now();

    public void setJobApplication(JobApplicationDTO appDto) {
    }
}
