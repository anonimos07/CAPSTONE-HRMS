package com.capstone.HRMS.Service;

import com.capstone.HRMS.Entity.*;
import com.capstone.HRMS.Repository.TimelogEditRequestRepository;
import com.capstone.HRMS.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TimelogEditRequestService {

    @Autowired
    private TimelogEditRequestRepository timelogEditRequestRepository;

    @Autowired
    private UserRepo userRepository;

    @Autowired
    private NotificationService notificationService;

    // Create a new timelog edit request
    public TimelogEditRequest createEditRequest(Timelog timelog, Users employee, Users assignedHr, 
                                               String reason, LocalDateTime requestedTimeIn, 
                                               LocalDateTime requestedTimeOut, Long requestedBreakDuration) {
        TimelogEditRequest request = new TimelogEditRequest(timelog, employee, assignedHr, reason);
        request.setRequestedTimeIn(requestedTimeIn);
        request.setRequestedTimeOut(requestedTimeOut);
        request.setRequestedBreakDuration(requestedBreakDuration);
        
        TimelogEditRequest savedRequest = timelogEditRequestRepository.save(request);
        
        // Send notification to assigned HR
        String employeeName = getEmployeeName(employee);
        String notificationTitle = "New Timelog Edit Request";
        String notificationMessage = String.format(
            "%s has requested to edit their timelog for %s. Reason: %s", 
            employeeName, 
            timelog.getLogDate().toLocalDate().toString(),
            reason.length() > 100 ? reason.substring(0, 100) + "..." : reason
        );
        
        notificationService.createNotification(
            assignedHr, 
            notificationTitle, 
            notificationMessage, 
            NotificationType.TIMELOG_EDIT_REQUEST,
            savedRequest.getId()
        );
        
        return savedRequest;
    }

    // Get all HR staff for dropdown
    public List<Users> getAllHrStaff() {
        return userRepository.findByRole(Role.HR);
    }

    // Get requests by employee
    public List<TimelogEditRequest> getRequestsByEmployee(Users employee) {
        return timelogEditRequestRepository.findByEmployeeOrderByCreatedDateDesc(employee);
    }

    // Get requests assigned to HR
    public List<TimelogEditRequest> getRequestsByHr(Users hr) {
        return timelogEditRequestRepository.findByAssignedHrOrderByCreatedDateDesc(hr);
    }

    // Get pending requests by HR
    public List<TimelogEditRequest> getPendingRequestsByHr(Users hr) {
        return timelogEditRequestRepository.findPendingRequestsByHr(hr);
    }

    // Get all pending requests (for admin)
    public List<TimelogEditRequest> getAllPendingRequests() {
        return timelogEditRequestRepository.findAllPendingRequests();
    }

    // Approve request
    public TimelogEditRequest approveRequest(Long requestId, Users hrUser, String hrResponse) {
        TimelogEditRequest request = timelogEditRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        
        if (!canProcessRequest(hrUser, request)) {
            throw new RuntimeException("You don't have permission to process this request");
        }
        
        request.setStatus(TimelogEditRequest.RequestStatus.APPROVED);
        request.setHrResponse(hrResponse);
        request.setProcessedByHr(hrUser);
        request.setProcessedDate(LocalDateTime.now());
        request.setUpdatedDate(LocalDateTime.now());
        
        TimelogEditRequest savedRequest = timelogEditRequestRepository.save(request);
        
        // Send notification to employee
        String notificationTitle = "Timelog Edit Request Approved";
        String notificationMessage = String.format(
            "Your timelog edit request for %s has been approved by %s.", 
            request.getTimelog().getLogDate().toLocalDate().toString(),
            getEmployeeName(hrUser)
        );
        
        notificationService.createNotification(
            request.getEmployee(), 
            notificationTitle, 
            notificationMessage, 
            NotificationType.TIMELOG_EDIT_REQUEST,
            savedRequest.getId()
        );
        
        return savedRequest;
    }

    // Reject request
    public TimelogEditRequest rejectRequest(Long requestId, Users hrUser, String hrResponse) {
        TimelogEditRequest request = timelogEditRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        
        if (!canProcessRequest(hrUser, request)) {
            throw new RuntimeException("You don't have permission to process this request");
        }
        
        request.setStatus(TimelogEditRequest.RequestStatus.REJECTED);
        request.setHrResponse(hrResponse);
        request.setProcessedByHr(hrUser);
        request.setProcessedDate(LocalDateTime.now());
        request.setUpdatedDate(LocalDateTime.now());
        
        TimelogEditRequest savedRequest = timelogEditRequestRepository.save(request);
        
        // Send notification to employee
        String notificationTitle = "Timelog Edit Request Rejected";
        String notificationMessage = String.format(
            "Your timelog edit request for %s has been rejected by %s. Reason: %s", 
            request.getTimelog().getLogDate().toLocalDate().toString(),
            getEmployeeName(hrUser),
            hrResponse
        );
        
        notificationService.createNotification(
            request.getEmployee(), 
            notificationTitle, 
            notificationMessage, 
            NotificationType.TIMELOG_EDIT_REQUEST,
            savedRequest.getId()
        );
        
        return savedRequest;
    }

    // Get request by ID
    public TimelogEditRequest getRequestById(Long requestId) {
        return timelogEditRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
    }

    // Count pending requests for HR
    public Long countPendingRequestsByHr(Users hr) {
        return timelogEditRequestRepository.countPendingRequestsByHr(hr);
    }

    // Check if user can process request
    private boolean canProcessRequest(Users hrUser, TimelogEditRequest request) {
        if (hrUser.getRole() == Role.ADMIN) {
            return true;
        }
        if (hrUser.getRole() == Role.HR) {
            return request.getAssignedHr().getUserId() == hrUser.getUserId();
        }
        return false;
    }

    // Helper method to get employee name
    private String getEmployeeName(Users user) {
        if (user.getEmployeeDetails() != null) {
            String firstName = user.getEmployeeDetails().getFirstName();
            String lastName = user.getEmployeeDetails().getLastName();
            if (firstName != null && lastName != null) {
                return firstName + " " + lastName;
            } else if (firstName != null) {
                return firstName;
            } else if (lastName != null) {
                return lastName;
            }
        }
        return user.getUsername();
    }
}
