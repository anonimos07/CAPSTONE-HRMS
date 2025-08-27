package com.capstone.HRMS.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "users")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long userId;

    public String username;
    public String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "is_enabled", nullable = false)
    private boolean isEnabled = true;

    @OneToOne(mappedBy = "user", cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE})
    @JsonManagedReference
    private EmployeeDetails employeeDetails;

    @ManyToOne
    @JoinColumn(name = "position_id")
    @JsonBackReference
    private Position position;

    public Users() {
    }

    public Users(String username, String password, Role role, Position position) {
        this.username = username;
        this.password = password;
        this.role = role;
        this.position = position;
        this.isEnabled = true;
    }
}
