package com.capstone.HRMS.Controller;

import com.capstone.HRMS.Entity.*;
import com.capstone.HRMS.Service.LeaveRequestService;
import com.capstone.HRMS.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/leave-request")
@CrossOrigin(origins = "*")
public class LeaveRequestController {

    @Autowired
    private LeaveRequestService leaveRequestService;

    @Autowired
    private UserRepo userRepo;

    @PostMapping("/submit")
    public ResponseEntity<?> submitLeaveRequest(@RequestBody Map<String, Object> requestData, Authentication authentication) {
        try {
            System.out.println("=== DEBUG: Submit Leave Request ===");
            System.out.println("Authentication: " + authentication);
            System.out.println("Username: " + (authentication != null ? authentication.getName() : "null"));
            System.out.println("Request Data: " + requestData);
            
            if (authentication == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication required");
            }
            
            String username = authentication.getName();
            System.out.println("Looking up user: " + username);
            
            Optional<Users> employee = userRepo.findByUsername(username);
            if (!employee.isPresent()) {
                System.out.println("Employee not found for username: " + username);
                return ResponseEntity.badRequest().body("Employee not found");
            }
            
            System.out.println("Found employee: " + employee.get().getUserId());

            LeaveType leaveType = LeaveType.valueOf(requestData.get("leaveType").toString());
            LocalDate startDate = LocalDate.parse(requestData.get("startDate").toString());
            LocalDate endDate = LocalDate.parse(requestData.get("endDate").toString());
            String reason = requestData.get("reason").toString();
            
            System.out.println("Parsed data - LeaveType: " + leaveType + ", StartDate: " + startDate + ", EndDate: " + endDate);

            LeaveRequest leaveRequest = leaveRequestService.submitLeaveRequest(
                employee.get(), leaveType, startDate, endDate, reason
            );

            System.out.println("Leave request created successfully with ID: " + leaveRequest.getId());
            return ResponseEntity.ok(leaveRequest);
        } catch (IllegalArgumentException e) {
            System.out.println("IllegalArgumentException: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.out.println("Exception in submitLeaveRequest: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error submitting leave request: " + e.getMessage());
        }
    }

    @GetMapping("/hr")
    public ResponseEntity<List<LeaveRequest>> getPendingRequestsForHR(Authentication authentication) {
        try {
            String username = authentication.getName();
            Optional<Users> user = userRepo.findByUsername(username);
            
            if (!user.isPresent()) {
                return ResponseEntity.badRequest().body(null);
            }
            
            Users currentUser = user.get();
            String userPosition = currentUser.getPosition() != null ? currentUser.getPosition().getTitle() : "";
            
            // Only HR-Manager and HR-Supervisor can view pending requests
            if (!"HR-Manager".equals(userPosition) && !"HR-Supervisor".equals(userPosition)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
            }
            
            List<LeaveRequest> pendingRequests = leaveRequestService.getPendingRequestsForHR();
            return ResponseEntity.ok(pendingRequests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<?> approveLeaveRequest(
            @PathVariable Long id,
            @RequestBody Map<String, Object> requestData,
            Authentication authentication) {
        try {
            System.out.println("=== DEBUG: Approve Leave Request ===");
            System.out.println("Request ID: " + id);
            System.out.println("Authentication: " + authentication);
            System.out.println("Request Data: " + requestData);
            
            String username = authentication.getName();
            String comments = requestData.getOrDefault("comments", "").toString();

            Optional<Users> approver = userRepo.findByUsername(username);
            if (!approver.isPresent()) {
                System.out.println("Approver not found for username: " + username);
                return ResponseEntity.badRequest().body("Approver not found");
            }

            // Check if approver has permission based on the requester's role
            Users approverUser = approver.get();
            Optional<LeaveRequest> requestOpt = leaveRequestService.getLeaveRequestById(id);
            if (!requestOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Leave request not found");
            }
            
            LeaveRequest request = requestOpt.get();
            boolean canApprove = false;
            
            if (request.getEmployee().getRole() == Role.HR) {
                // HR leave requests can only be approved by HR-Supervisor or HR-Manager
                canApprove = approverUser.getRole() == Role.ADMIN ||
                           (approverUser.getPosition() != null && 
                            ("HR-Supervisor".equals(approverUser.getPosition().getTitle()) ||
                             "HR-Manager".equals(approverUser.getPosition().getTitle())));
            } else {
                // Employee leave requests can be approved by HR or HR-Supervisor
                canApprove = approverUser.getRole() == Role.HR || 
                           approverUser.getRole() == Role.ADMIN ||
                           (approverUser.getPosition() != null && 
                            "HR-Supervisor".equals(approverUser.getPosition().getTitle()));
            }

            if (!canApprove) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Insufficient permissions to approve this leave request");
            }

            LeaveRequest approvedRequest = leaveRequestService.approveLeaveRequest(id, approverUser, comments);
            System.out.println("Leave request approved successfully: " + approvedRequest.getId());
            return ResponseEntity.ok(approvedRequest);
        } catch (IllegalArgumentException e) {
            System.out.println("IllegalArgumentException in approve: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.out.println("Exception in approveLeaveRequest: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error approving leave request: " + e.getMessage());
        }
    }

    @PutMapping("/reject/{id}")
    public ResponseEntity<?> rejectLeaveRequest(
            @PathVariable Long id,
            @RequestBody Map<String, Object> requestData,
            Authentication authentication) {
        try {
            System.out.println("=== DEBUG: Reject Leave Request ===");
            System.out.println("Request ID: " + id);
            System.out.println("Authentication: " + authentication);
            System.out.println("Request Data: " + requestData);
            
            String username = authentication.getName();
            String comments = requestData.getOrDefault("comments", "").toString();

            Optional<Users> approver = userRepo.findByUsername(username);
            if (!approver.isPresent()) {
                System.out.println("Approver not found for username: " + username);
                return ResponseEntity.badRequest().body("Approver not found");
            }

            // Check if approver has permission based on the requester's role
            Users approverUser = approver.get();
            Optional<LeaveRequest> requestOpt = leaveRequestService.getLeaveRequestById(id);
            if (!requestOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Leave request not found");
            }
            
            LeaveRequest request = requestOpt.get();
            boolean canReject = false;
            
            if (request.getEmployee().getRole() == Role.HR) {
                // HR leave requests can only be rejected by HR-Supervisor or HR-Manager
                canReject = approverUser.getRole() == Role.ADMIN ||
                          (approverUser.getPosition() != null && 
                           ("HR-Supervisor".equals(approverUser.getPosition().getTitle()) ||
                            "HR-Manager".equals(approverUser.getPosition().getTitle())));
            } else {
                // Employee leave requests can be rejected by HR or HR-Supervisor
                canReject = approverUser.getRole() == Role.HR || 
                          approverUser.getRole() == Role.ADMIN ||
                          (approverUser.getPosition() != null && 
                           "HR-Supervisor".equals(approverUser.getPosition().getTitle()));
            }

            if (!canReject) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Insufficient permissions to reject this leave request");
            }

            LeaveRequest rejectedRequest = leaveRequestService.rejectLeaveRequest(id, approverUser, comments);
            System.out.println("Leave request rejected successfully: " + rejectedRequest.getId());
            return ResponseEntity.ok(rejectedRequest);
        } catch (IllegalArgumentException e) {
            System.out.println("IllegalArgumentException in reject: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.out.println("Exception in rejectLeaveRequest: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error rejecting leave request: " + e.getMessage());
        }
    }

    @GetMapping("/balance")
    public ResponseEntity<?> getLeaveBalance(Authentication authentication) {
        try {
            String username = authentication.getName();
            Optional<Users> employee = userRepo.findByUsername(username);
            if (!employee.isPresent()) {
                return ResponseEntity.badRequest().body("Employee not found");
            }

            List<LeaveBalance> balances = leaveRequestService.getEmployeeLeaveBalances(employee.get());
            return ResponseEntity.ok(balances);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching leave balance");
        }
    }

    @GetMapping("/employee")
    public ResponseEntity<?> getEmployeeLeaveRequests(Authentication authentication) {
        try {
            String username = authentication.getName();
            Optional<Users> employee = userRepo.findByUsername(username);
            if (!employee.isPresent()) {
                return ResponseEntity.badRequest().body("Employee not found");
            }

            List<LeaveRequest> requests = leaveRequestService.getEmployeeLeaveRequests(employee.get());
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching leave requests");
        }
    }

    @GetMapping("/pending-count")
    public ResponseEntity<Long> getPendingRequestsCount() {
        try {
            long count = leaveRequestService.getPendingRequestsCount();
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(0L);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getLeaveRequestById(@PathVariable Long id) {
        try {
            Optional<LeaveRequest> request = leaveRequestService.getLeaveRequestById(id);
            if (request.isPresent()) {
                return ResponseEntity.ok(request.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching leave request");
        }
    }
}
