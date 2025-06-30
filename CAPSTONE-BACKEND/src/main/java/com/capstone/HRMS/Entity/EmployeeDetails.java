package com.capstone.HRMS.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@Entity
@Table(name = "employeeDetails")
public class EmployeeDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public long employeeId;

    public String email;
    public String firstName;
    public String lastName;
    public String contact;
    public String department;

    public EmployeeDetails(){

    }
}
