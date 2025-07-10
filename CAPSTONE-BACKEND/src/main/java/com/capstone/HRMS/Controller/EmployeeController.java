package com.capstone.HRMS.Controller;

import com.capstone.HRMS.Entity.EmployeeDetails;
import com.capstone.HRMS.Entity.Role;
import com.capstone.HRMS.Entity.Users;
import com.capstone.HRMS.Repository.UserRepo;
import com.capstone.HRMS.Service.EmployeeService;
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
@RequestMapping("/employee")
@RequiredArgsConstructor
public class EmployeeController {
    private final EmployeeService employeeService;
    private final UserRepo userRepo;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Users loginRequest) {
        String result = employeeService.verify(loginRequest, Role.EMPLOYEE);

        if (result.equals("failed") || result.equals("unauthorized")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("error", "Authentication failed"));
        }

        Optional<Users> dbEmpOpt = userRepo.findByUsername(loginRequest.getUsername());
        if (dbEmpOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("error", "Employee not found"));
        }

        Users dbEmp = dbEmpOpt.get();

        Map<String, Object> response = new HashMap<>();
        response.put("token", result);
        response.put("role", dbEmp.getRole().name());
        response.put("username", dbEmp.getUsername());
        response.put("userId", dbEmp.getUserId());

        return ResponseEntity.ok(response);
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
}
