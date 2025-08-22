package com.capstone.HRMS.Service;

import com.capstone.HRMS.Entity.*;
import com.capstone.HRMS.Repository.JobApplicationRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepo jobApplicationRepository;
    
    
    @Autowired
    private NotificationService notificationService;

    public JobApplication submitApplication(String positionTitle, String email, String contact,
                                            String fullName, MultipartFile file) throws Exception {
        JobApplication application = new JobApplication(positionTitle, email, contact, fullName, 
                                                       file.getBytes(), file.getOriginalFilename());

        JobApplication savedApplication = jobApplicationRepository.save(application);
        
        // Notify HR users in the same position
        String notificationTitle = "New Job Application";
        String notificationMessage = fullName + " has applied for the " + positionTitle + " position.";
        notificationService.notifyUsersByRole(Role.HR, notificationTitle, notificationMessage, 
                                            NotificationType.JOB_APPLICATION, savedApplication.getJobApplicationId());

        return savedApplication;
    }
    
    public List<JobApplication> getAllApplications() {
        return jobApplicationRepository.findAll();
    }
    
    public Optional<JobApplication> getApplicationById(Long id) {
        return jobApplicationRepository.findById(id);
    }
    
    public JobApplication updateApplicationStatus(Long id, ApplicationStatus status, String reviewNotes) {
        Optional<JobApplication> applicationOpt = jobApplicationRepository.findById(id);
        if (applicationOpt.isPresent()) {
            JobApplication application = applicationOpt.get();
            application.setStatus(status);
            application.setReviewNotes(reviewNotes);
            return jobApplicationRepository.save(application);
        }
        return null;
    }
}

