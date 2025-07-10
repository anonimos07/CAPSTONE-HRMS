package com.capstone.HRMS.Repository;

import com.capstone.HRMS.Entity.Position;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PositionRepo extends JpaRepository<Position, Long> {
    Optional<Position> findByTitle(String title);
}
