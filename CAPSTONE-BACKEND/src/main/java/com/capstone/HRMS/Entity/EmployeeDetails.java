package com.capstone.HRMS.Entity;

import jakarta.annotation.Nullable;
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

    @Nullable
    public String email;
    @Nullable
    public String firstName;
    @Nullable
    public String lastName;
    @Nullable
    public String contact;
    @Nullable
    public String department;
    @Nullable
    public String position;
    @Nullable
    public String address;

    @OneToOne
    @JoinColumn(name = "user_id")
    private Users user;


    public EmployeeDetails(){

    }

    public void setUser(Users user) {
        this.user = user;
        user.setEmployeeDetails(this);
    }
}
