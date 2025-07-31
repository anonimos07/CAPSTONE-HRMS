package com.capstone.HRMS.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter@Setter
public class JobApplicationDTO {
    private Long id;
    private String position;
    private String email;
    private String contact;
    private String fullName;
}
