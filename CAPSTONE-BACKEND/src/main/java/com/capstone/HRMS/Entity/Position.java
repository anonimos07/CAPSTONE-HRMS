package com.capstone.HRMS.Entity;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter @Setter
@Entity
@Table(name = "position")
public class Position {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long positionId;

    public String title;

    @OneToMany(mappedBy = "position")
    @JsonManagedReference
    private List<Users> users;


    public Position(){

    }

    public Position(String title){
        this.title = title;
    }
}
