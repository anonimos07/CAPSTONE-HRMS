package com.capstone.HRMS.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
    public String address;
    
    @Nullable
    @Column(name = "profile_picture")
    public String profilePicture;

    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private Users user;


    public EmployeeDetails(){

    }

    public void setUser(Users user) {
        this.user = user;
        user.setEmployeeDetails(this);
    }
}
