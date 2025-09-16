package com.capstone.HRMS.Service;

import com.capstone.HRMS.Entity.*;
import com.capstone.HRMS.Repository.LeaveBalanceRepository;
import com.capstone.HRMS.Repository.LeaveRequestRepository;
import com.capstone.HRMS.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Year;
import java.util.List;
import java.util.Optional;

@Service
public class LeaveRequestService {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private LeaveBalanceRepository leaveBalanceRepository;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public LeaveRequest submitLeaveRequest(Users employee, LeaveType leaveType, LocalDate startDate, LocalDate endDate, String reason) {

        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }

        if (startDate.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Cannot request leave for past dates");
        }


        List<LeaveRequest> overlappingRequests = leaveRequestRepository.findOverlappingLeaveRequests(employee, startDate, endDate);
        if (!overlappingRequests.isEmpty()) {
            throw new IllegalArgumentException("You already have a leave request for overlapping dates");
        }


        long daysRequested = startDate.datesUntil(endDate.plusDays(1)).count();


        int currentYear = Year.now().getValue();
        Optional<LeaveBalance> leaveBalance = leaveBalanceRepository.findByEmployeeAndLeaveTypeAndYear(employee, leaveType, currentYear);
        
        if (leaveBalance.isPresent() && !leaveBalance.get().hasEnoughBalance((int) daysRequested)) {
            throw new IllegalArgumentException("Insufficient leave balance. Available: " + leaveBalance.get().getRemainingDays() + " days");
        }


        LeaveRequest leaveRequest = new LeaveRequest(employee, leaveType, startDate, endDate, reason);
        LeaveRequest savedRequest = leaveRequestRepository.save(leaveRequest);


        notifyHRUsers(savedRequest);

        return savedRequest;
    }

    @Transactional
    public LeaveRequest approveLeaveRequest(Long requestId, Users approver, String comments) {
        Optional<LeaveRequest> requestOpt = leaveRequestRepository.findById(requestId);
        if (!requestOpt.isPresent()) {
            throw new IllegalArgumentException("Leave request not found");
        }

        LeaveRequest request = requestOpt.get();
        if (request.getStatus() != LeaveStatus.PENDING) {
            throw new IllegalArgumentException("Leave request is not pending");
        }


        request.setStatus(LeaveStatus.APPROVED);
        request.setApprovedBy(approver);
        request.setApprovalComments(comments);


        updateLeaveBalance(request.getEmployee(), request.getLeaveType(), (int) request.getDaysRequested());

        LeaveRequest savedRequest = leaveRequestRepository.save(request);


        String approverName = approver.getEmployeeDetails().getFirstName() + " " + approver.getEmployeeDetails().getLastName();
        String approverPosition = approver.getPosition() != null ? approver.getPosition().getTitle() : "HR";
        
        notificationService.createNotification(
            request.getEmployee(),
            "Leave Request Approved",
            "Your " + request.getLeaveType() + " leave request from " + request.getStartDate() + " to " + request.getEndDate() + " has been approved by " + approverName + " (" + approverPosition + ").",
            NotificationType.GENERAL,
            savedRequest.getId()
        );

        return savedRequest;
    }

    @Transactional
    public LeaveRequest rejectLeaveRequest(Long requestId, Users approver, String comments) {
        Optional<LeaveRequest> requestOpt = leaveRequestRepository.findById(requestId);
        if (!requestOpt.isPresent()) {
            throw new IllegalArgumentException("Leave request not found");
        }

        LeaveRequest request = requestOpt.get();
        if (request.getStatus() != LeaveStatus.PENDING) {
            throw new IllegalArgumentException("Leave request is not pending");
        }


        request.setStatus(LeaveStatus.REJECTED);
        request.setApprovedBy(approver);
        request.setApprovalComments(comments);

        LeaveRequest savedRequest = leaveRequestRepository.save(request);


        String approverName = approver.getEmployeeDetails().getFirstName() + " " + approver.getEmployeeDetails().getLastName();
        String approverPosition = approver.getPosition() != null ? approver.getPosition().getTitle() : "HR";
        
        notificationService.createNotification(
            request.getEmployee(),
            "Leave Request Rejected",
            "Your " + request.getLeaveType() + " leave request from " + request.getStartDate() + " to " + request.getEndDate() + " has been rejected by " + approverName + " (" + approverPosition + "). Reason: " + comments,
            NotificationType.GENERAL,
            savedRequest.getId()
        );

        return savedRequest;
    }

    public List<LeaveRequest> getPendingRequestsForHR() {
        return leaveRequestRepository.findAllRequestsForHR();
    }

    public List<LeaveRequest> getEmployeeLeaveRequests(Users employee) {
        return leaveRequestRepository.findByEmployeeOrderByCreatedAtDesc(employee);
    }

    public List<LeaveBalance> getEmployeeLeaveBalances(Users employee) {
        int currentYear = Year.now().getValue();
        List<LeaveBalance> balances = leaveBalanceRepository.findByEmployeeAndYear(employee, currentYear);
        

        if (balances.isEmpty()) {
            initializeEmployeeLeaveBalances(employee, currentYear);
            balances = leaveBalanceRepository.findByEmployeeAndYear(employee, currentYear);
        }
        
        return balances;
    }

    @Transactional
    public List<LeaveBalance> ensureLeaveBalancesExist(Users employee) {
        return getEmployeeLeaveBalances(employee);
    }

    @Transactional
    public void initializeEmployeeLeaveBalances(Users employee, int year) {

        LeaveBalance annualLeave = new LeaveBalance(employee, LeaveType.ANNUAL, 21, year);
        LeaveBalance sickLeave = new LeaveBalance(employee, LeaveType.SICK, 10, year);
        LeaveBalance personalLeave = new LeaveBalance(employee, LeaveType.PERSONAL, 5, year);
        LeaveBalance emergencyLeave = new LeaveBalance(employee, LeaveType.EMERGENCY, 3, year);

        leaveBalanceRepository.save(annualLeave);
        leaveBalanceRepository.save(sickLeave);
        leaveBalanceRepository.save(personalLeave);
        leaveBalanceRepository.save(emergencyLeave);
    }

    @Transactional
    private void updateLeaveBalance(Users employee, LeaveType leaveType, int daysUsed) {
        int currentYear = Year.now().getValue();
        Optional<LeaveBalance> balanceOpt = leaveBalanceRepository.findByEmployeeAndLeaveTypeAndYear(employee, leaveType, currentYear);
        
        if (balanceOpt.isPresent()) {
            LeaveBalance balance = balanceOpt.get();
            balance.updateUsedDays(daysUsed);
            leaveBalanceRepository.save(balance);
        }
    }

    private void notifyHRUsers(LeaveRequest leaveRequest) {
        String title = "New Leave Request Submitted";
        String message = leaveRequest.getEmployee().getEmployeeDetails().getFirstName() + " " + 
                        leaveRequest.getEmployee().getEmployeeDetails().getLastName() + 
                        " has submitted a " + leaveRequest.getLeaveType() + " leave request from " + 
                        leaveRequest.getStartDate() + " to " + leaveRequest.getEndDate();


        if (leaveRequest.getEmployee().getRole() == Role.HR) {

            List<Users> hrSupervisors = userRepo.findByPositionTitle("HR-Supervisor");
            List<Users> hrManagers = userRepo.findByPositionTitle("HR-Manager");
            
            for (Users user : hrSupervisors) {
                notificationService.createNotification(user, title, message, NotificationType.GENERAL, leaveRequest.getId());
            }
            for (Users user : hrManagers) {
                notificationService.createNotification(user, title, message, NotificationType.GENERAL, leaveRequest.getId());
            }
        } else {

            List<Users> hrUsers = userRepo.findByRole(Role.HR);
            List<Users> hrSupervisors = userRepo.findByPositionTitle("HR-Supervisor");

            for (Users user : hrUsers) {
                notificationService.createNotification(user, title, message, NotificationType.GENERAL, leaveRequest.getId());
            }
            for (Users user : hrSupervisors) {
                notificationService.createNotification(user, title, message, NotificationType.GENERAL, leaveRequest.getId());
            }
        }
    }

    public long getPendingRequestsCount() {
        return leaveRequestRepository.countPendingRequests();
    }

    public Optional<LeaveRequest> getLeaveRequestById(Long id) {
        return leaveRequestRepository.findById(id);
    }
}
