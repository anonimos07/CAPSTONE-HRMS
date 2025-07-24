package com.capstone.HRMS.Repository;

import com.capstone.HRMS.Entity.Position;
import com.capstone.HRMS.Entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<Users, Long> {
    Optional<Users> findByUsername(String username);
    List<Users> findByPosition(Position position);


    //for admin post construct
    boolean existsByUsername(String username);
}