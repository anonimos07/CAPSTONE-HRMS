package com.capstone.HRMS.Repository;


import com.capstone.HRMS.Entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobApplicationRepo extends JpaRepository<JobApplication, Long> {
}
