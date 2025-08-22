package com.capstone.HRMS.Service;

import com.capstone.HRMS.Entity.JobPosition;
import com.capstone.HRMS.Repository.JobPositionRepo;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class JobPositionService {

    private final JobPositionRepo jobPositionRepository;

    public JobPositionService(JobPositionRepo jobPositionRepository) {
        this.jobPositionRepository = jobPositionRepository;
    }

    public JobPosition addJobPosition(JobPosition jobPosition) {
        return jobPositionRepository.save(jobPosition);
    }

    public List<JobPosition> getAllJobPositions() {
        return jobPositionRepository.findByActiveTrue();
    }

    public JobPosition getJobPositionById(Long id) {
        return jobPositionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job Position not found"));
    }

    public JobPosition updateJobPosition(Long id, JobPosition jobPosition) {
        JobPosition existingPosition = getJobPositionById(id);
        existingPosition.setTitle(jobPosition.getTitle());
        existingPosition.setDescription(jobPosition.getDescription());
        existingPosition.setDepartment(jobPosition.getDepartment());
        existingPosition.setLocation(jobPosition.getLocation());
        existingPosition.setActive(jobPosition.getActive());
        return jobPositionRepository.save(existingPosition);
    }

    public void deleteJobPosition(Long id) {
        JobPosition jobPosition = getJobPositionById(id);
        jobPosition.setActive(false);
        jobPositionRepository.save(jobPosition);
    }
}
