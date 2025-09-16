package com.capstone.HRMS.Controller;

import com.capstone.HRMS.Entity.TimelogEditRequest;
import com.capstone.HRMS.Entity.Timelog;
import com.capstone.HRMS.Entity.Users;
import com.capstone.HRMS.Service.TimelogEditRequestService;
import com.capstone.HRMS.Service.TimelogService;
import com.capstone.HRMS.Service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/timelog-edit-request")
@CrossOrigin(origins = "*")
public class TimelogEditRequestController {

    @Autowired
    private TimelogEditRequestService timelogEditRequestService;

    @Autowired
    private TimelogService timelogService;

    @Autowired
    private UsersService usersService;


    @PostMapping("/create")
    public ResponseEntity<?> createEditRequest(@RequestBody Map<String, Object> request, Authentication authentication) {
        try {
            System.out.println("=== DEBUG: Received request payload ===");
            System.out.println("Request data: " + request);
            
            String username = authentication.getName();
            System.out.println("Authenticated user: " + username);
            
            Users employee = usersService.getUserByUsername(username);
            if (employee == null) {
                System.out.println("ERROR: User not found for username: " + username);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            Long timelogId = Long.valueOf(request.get("timelogId").toString());
            Long assignedHrId = Long.valueOf(request.get("assignedHrId").toString());
            String reason = request.get("reason").toString();
            
            System.out.println("Parsed values - timelogId: " + timelogId + ", assignedHrId: " + assignedHrId + ", reason: " + reason);

            LocalDateTime requestedTimeIn = request.get("requestedTimeIn") != null ? 
                LocalDateTime.parse(request.get("requestedTimeIn").toString().replace("Z", "")) : null;
            LocalDateTime requestedTimeOut = request.get("requestedTimeOut") != null ? 
                LocalDateTime.parse(request.get("requestedTimeOut").toString().replace("Z", "")) : null;
            Long requestedBreakDuration = request.get("requestedBreakDuration") != null ? 
                Long.valueOf(request.get("requestedBreakDuration").toString()) : null;

            System.out.println("DateTime values - timeIn: " + requestedTimeIn + ", timeOut: " + requestedTimeOut + ", breakDuration: " + requestedBreakDuration);

            Timelog timelog = timelogService.getTimelogById(timelogId);
            Users assignedHr = usersService.getUserById(assignedHrId);
            
            System.out.println("Found timelog: " + (timelog != null) + ", Found HR: " + (assignedHr != null));

            TimelogEditRequest editRequest = timelogEditRequestService.createEditRequest(
                timelog, employee, assignedHr, reason, requestedTimeIn, requestedTimeOut, requestedBreakDuration
            );

            System.out.println("Successfully created edit request with ID: " + editRequest.getId());
            return ResponseEntity.ok(editRequest);
        } catch (RuntimeException e) {
            System.out.println("RuntimeException: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.out.println("General Exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while creating edit request");
        }
    }

    // Get all HR staff for dropdown
    @GetMapping("/hr-staff")
    public ResponseEntity<?> getAllHrStaff(Authentication authentication) {
        try {
            String username = authentication.getName();
            Users user = usersService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            List<Users> hrStaff = timelogEditRequestService.getAllHrStaff();
            return ResponseEntity.ok(hrStaff);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while getting HR staff");
        }
    }

    // Get requests by employee
    @GetMapping("/employee")
    public ResponseEntity<?> getRequestsByEmployee(Authentication authentication) {
        try {
            String username = authentication.getName();
            Users employee = usersService.getUserByUsername(username);
            if (employee == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            List<TimelogEditRequest> requests = timelogEditRequestService.getRequestsByEmployee(employee);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while getting requests");
        }
    }

    // Get requests assigned to HR
    @GetMapping("/hr")
    public ResponseEntity<?> getRequestsByHr(Authentication authentication) {
        try {
            String username = authentication.getName();
            Users hr = usersService.getUserByUsername(username);
            if (hr == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            // Check if user has HR or Admin role
            if (!hr.getRole().name().equals("HR") && !hr.getRole().name().equals("ADMIN")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }

            List<TimelogEditRequest> requests = timelogEditRequestService.getRequestsByHr(hr);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while getting requests");
        }
    }

    // Get pending requests by HR
    @GetMapping("/hr/pending")
    public ResponseEntity<?> getPendingRequestsByHr(Authentication authentication) {
        try {
            String username = authentication.getName();
            Users hr = usersService.getUserByUsername(username);
            if (hr == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            // Check if user has HR or Admin role
            if (!hr.getRole().name().equals("HR") && !hr.getRole().name().equals("ADMIN")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }

            List<TimelogEditRequest> requests = timelogEditRequestService.getPendingRequestsByHr(hr);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while getting pending requests");
        }
    }

    // Approve request
    @PutMapping("/approve/{requestId}")
    public ResponseEntity<?> approveRequest(@PathVariable Long requestId, @RequestBody Map<String, String> request, Authentication authentication) {
        try {
            String username = authentication.getName();
            Users hrUser = usersService.getUserByUsername(username);
            if (hrUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            String hrResponse = request.get("hrResponse");
            TimelogEditRequest approvedRequest = timelogEditRequestService.approveRequest(requestId, hrUser, hrResponse);
            return ResponseEntity.ok(approvedRequest);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while approving request");
        }
    }

    // Reject request
    @PutMapping("/reject/{requestId}")
    public ResponseEntity<?> rejectRequest(@PathVariable Long requestId, @RequestBody Map<String, String> request, Authentication authentication) {
        try {
            String username = authentication.getName();
            Users hrUser = usersService.getUserByUsername(username);
            if (hrUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            String hrResponse = request.get("hrResponse");
            TimelogEditRequest rejectedRequest = timelogEditRequestService.rejectRequest(requestId, hrUser, hrResponse);
            return ResponseEntity.ok(rejectedRequest);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while rejecting request");
        }
    }

    // Get request by ID
    @GetMapping("/{requestId}")
    public ResponseEntity<?> getRequestById(@PathVariable Long requestId, Authentication authentication) {
        try {
            String username = authentication.getName();
            Users user = usersService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            TimelogEditRequest request = timelogEditRequestService.getRequestById(requestId);
            return ResponseEntity.ok(request);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while getting request");
        }
    }
}
