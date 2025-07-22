package com.capstone.HRMS.Repository;


import com.capstone.HRMS.Entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JobApplicationRepo extends JpaRepository<JobApplication, Long> {
    Optional<JobApplication>findById(long jobApplicationId);

}
