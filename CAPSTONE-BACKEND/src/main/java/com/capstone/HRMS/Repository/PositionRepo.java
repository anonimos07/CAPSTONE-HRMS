package com.capstone.HRMS.Repository;

import com.capstone.HRMS.Entity.Position;
import com.capstone.HRMS.Entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PositionRepo extends JpaRepository<Position, Long> {
    Optional<Position> findByTitle(String title);
}
