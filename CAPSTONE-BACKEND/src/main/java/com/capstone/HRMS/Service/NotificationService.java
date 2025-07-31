package com.capstone.HRMS.Service;

import com.capstone.HRMS.Entity.JobApplication;
import com.capstone.HRMS.Entity.Notification;
import com.capstone.HRMS.Entity.Position;
import com.capstone.HRMS.Entity.Users;
import com.capstone.HRMS.Repository.NotificationRepo;
import com.capstone.HRMS.Repository.PositionRepo;
import com.capstone.HRMS.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;



@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepo notificationRepo;
    private final UserRepo userRepo;
    private final PositionRepo positionRepo;

//    @Transactional
//    public void createJobApplicationNotification(JobApplication jobApplication) {
//
//        Optional<Position> hrSupervisorPosition = positionRepo.findByTitle("HR-Supervisor");
//
//        if (hrSupervisorPosition.isPresent()) {
//
//            List<Users> hrSupervisors = userRepo.findByPosition(hrSupervisorPosition.get());
//
//            for (Users hrSupervisor : hrSupervisors) {
//                Notification notification = new Notification();
//                notification.setTitle("New Job Application Submitted");
//                notification.setMessage(String.format(
//                        "A new application has been submitted for %s by %s (%s)",
//                        jobApplication.getPosition(),
//                        jobApplication.getFullName(),
//                        jobApplication.getEmail()
//                ));
//                notification.setRecipient(hrSupervisor);
//                notification.setJobApplication(jobApplication);
//                notification.setTimestamp(LocalDateTime.now());
//                notification.setRead(false);
//
//                notificationRepo.save(notification);
//            }
//        } else {
//            System.out.println("HR-Supervisor position not found in database. No notifications were sent.");
//        }
//    }
}