package com.capstone.HRMS.Service;

import com.capstone.HRMS.Entity.JobApplication;
import com.capstone.HRMS.Repository.JobApplicationRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepo jobApplicationRepository;

    public JobApplication submitApplication(String position, String email, String contact,
                                            String fullName, MultipartFile file) throws Exception {
        JobApplication application = new JobApplication();
        application.setPosition(position);
        application.setEmail(email);
        application.setContact(contact);
        application.setFullName(fullName);
        application.setFile(file.getBytes());

        return jobApplicationRepository.save(application);
    }
}

