package com.capstone.HRMS.Repository;

import com.capstone.HRMS.Entity.JobPosition;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobPositionRepo extends JpaRepository<JobPosition, Long> {
    Optional<JobPosition> findByTitle(String title);
    List<JobPosition> findByActiveTrue();
    List<JobPosition> findByDepartment(String department);
}
