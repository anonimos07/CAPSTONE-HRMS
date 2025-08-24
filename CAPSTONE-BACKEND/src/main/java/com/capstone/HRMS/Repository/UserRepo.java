package com.capstone.HRMS.Repository;

import com.capstone.HRMS.Entity.Role;
import com.capstone.HRMS.Entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<Users, Long> {
    Optional<Users> findByUsername(String username);

    //for admin post construct
    boolean existsByUsername(String username);
    
    List<Users> findByRole(Role role);
    
    Optional<Users> findById(Long id);
    
    @Query("SELECT u FROM Users u WHERE u.position.title = :title")
    List<Users> findByPositionTitle(@Param("title") String title);
}