package com.capstone.HRMS.Repository;

import com.capstone.HRMS.Entity.ApplicationStatus;
import com.capstone.HRMS.Entity.JobApplication;
import com.capstone.HRMS.Entity.Position;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepo extends JpaRepository<JobApplication, Long> {
    Optional<JobApplication> findById(long jobApplicationId);
    
    List<JobApplication> findByPositionOrderBySubmittedAtDesc(Position position);
    
    List<JobApplication> findByStatusOrderBySubmittedAtDesc(ApplicationStatus status);
    
    List<JobApplication> findAllByOrderBySubmittedAtDesc();
    
    Long countByStatus(ApplicationStatus status);
}
