package com.capstone.HRMS.Controller;

import com.capstone.HRMS.Entity.EmployeeDetails;
import com.capstone.HRMS.Entity.Role;
import com.capstone.HRMS.Entity.Users;
import com.capstone.HRMS.Repository.UserRepo;
import com.capstone.HRMS.Service.EmployeeService;
import com.capstone.HRMS.Service.HRService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.Serializable;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/hr")
@RequiredArgsConstructor
public class HRController {
    private final HRService hrService;
    private final EmployeeService employeeService;
    private final UserRepo userRepo;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Users loginRequest) {
        String result = hrService.verify(loginRequest, Role.HR);

        if (result.equals("failed") || result.equals("unauthorized")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("error", "Authentication failed"));
        }

        Optional<Users> dbHrOpt = userRepo.findByUsername(loginRequest.getUsername());
        if (dbHrOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("error", "Employee not found"));
        }

        Users dbHr = dbHrOpt.get();
        String positionTitle = null;
        if (dbHr.getPosition() != null) {
            positionTitle = dbHr.getPosition().getTitle();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("token", result);
        response.put("role", dbHr.getRole().name());
        response.put("username", dbHr.getUsername());
        response.put("userId", dbHr.getUserId());
        response.put("position", positionTitle);

        return ResponseEntity.ok(response);
    }

    //cr8 hr
    @PostMapping("/create-hr")
    public ResponseEntity<String> createHr(@RequestBody Users hr) {
        try {
            hrService.saveHr(hr);
            return ResponseEntity.ok("HR created successfully by Admin");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //cr8 emp
    @PostMapping("/create-employee")
    public ResponseEntity<String> createEmployee(@RequestBody Users employee) {
        employeeService.saveEmployee(employee);
        return ResponseEntity.ok("Employee created successfully by admin");
    }

    @GetMapping("/details")
    public ResponseEntity<Map<String, Serializable>> getCurrentUserProfile(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Not authenticated"));
            }

            String username = authentication.getName();
            Optional<Users> employeeOptional = userRepo.findByUsername(username);

            if (employeeOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "User not found."));
            }

            EmployeeDetails empDetails = employeeOptional.get().getEmployeeDetails();


            if (empDetails == null) {
                return ResponseEntity.ok(Map.of(
                        "message", "Employee details not yet created"
                ));
            }

            return ResponseEntity.ok(Map.of(
                    "firstName", empDetails.getFirstName() != null ? empDetails.getFirstName() : "",
                    "lastName", empDetails.getLastName() != null ? empDetails.getLastName() : "",
                    "email", empDetails.getEmail() != null ? empDetails.getEmail() : "",
                    "contact", empDetails.getContact() != null ? empDetails.getContact() : "",
                    "department", empDetails.getDepartment() != null ? empDetails.getDepartment() : "",
                    "address", empDetails.getAddress() != null ? empDetails.getAddress() : ""
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Server error: " + e.getMessage()));
        }
    }

    @PutMapping("/update-profile")
    public ResponseEntity<Map<String, String>> updateEmployeeProfile(
            @RequestBody EmployeeDetails updateData,
            Authentication authentication) {
        String username = authentication.getName();
        employeeService.updateOwnProfile(username, updateData);
        return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
    }

    //testing
    @GetMapping
    public String hello(){
        return "test";
    }
}
