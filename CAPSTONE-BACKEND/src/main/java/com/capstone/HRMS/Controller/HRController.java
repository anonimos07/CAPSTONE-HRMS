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
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/hr")
@RequiredArgsConstructor
@CrossOrigin(origins = "${frontend.url}")
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
        

        if (!dbHr.isEnabled()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Collections.singletonMap("error", "Your account has been disabled"));
        }
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

    //Get all users for HR management
    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getAllUsers(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            List<Users> allUsers;
            
            if (search.isEmpty()) {
                allUsers = userRepo.findAll();
            } else {
                allUsers = userRepo.findByUsernameContainingIgnoreCase(search);
            }
            
            List<Map<String, Object>> userList = allUsers.stream()
                .map(user -> {
                    Map<String, Object> userInfo = new HashMap<>();
                    userInfo.put("userId", user.getUserId());
                    userInfo.put("username", user.getUsername());
                    userInfo.put("role", user.getRole().name());
                    userInfo.put("position", user.getPosition() != null ? user.getPosition().getTitle() : "No Position");
                    userInfo.put("isEnabled", user.isEnabled());
                    

                    if (user.getEmployeeDetails() != null) {
                        EmployeeDetails details = user.getEmployeeDetails();
                        userInfo.put("firstName", details.getFirstName());
                        userInfo.put("lastName", details.getLastName());
                        userInfo.put("email", details.getEmail());
                    }
                    
                    return userInfo;
                })
                .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("users", userList);
            response.put("totalUsers", userList.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error fetching users: " + e.getMessage()));
        }
    }

    //Get specific user details for HR viewing
    @GetMapping("/users/{userId}")
    public ResponseEntity<Map<String, Object>> getUserDetails(@PathVariable Long userId) {
        try {
            Optional<Users> userOpt = userRepo.findById(userId);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found"));
            }
            
            Users user = userOpt.get();
            Map<String, Object> userDetails = new HashMap<>();
            

            userDetails.put("userId", user.getUserId());
            userDetails.put("username", user.getUsername());
            userDetails.put("role", user.getRole().name());
            userDetails.put("position", user.getPosition() != null ? user.getPosition().getTitle() : "No Position");
            userDetails.put("isEnabled", user.isEnabled());
            

            if (user.getEmployeeDetails() != null) {
                EmployeeDetails details = user.getEmployeeDetails();
                userDetails.put("firstName", details.getFirstName() != null ? details.getFirstName() : "");
                userDetails.put("lastName", details.getLastName() != null ? details.getLastName() : "");
                userDetails.put("email", details.getEmail() != null ? details.getEmail() : "");
                userDetails.put("contact", details.getContact() != null ? details.getContact() : "");
                userDetails.put("department", details.getDepartment() != null ? details.getDepartment() : "");
                userDetails.put("address", details.getAddress() != null ? details.getAddress() : "");
                userDetails.put("profilePicture", details.getProfilePicture() != null ? details.getProfilePicture() : "");
            } else {
                userDetails.put("firstName", "");
                userDetails.put("lastName", "");
                userDetails.put("email", "");
                userDetails.put("contact", "");
                userDetails.put("department", "");
                userDetails.put("address", "");
                userDetails.put("profilePicture", "");
            }
            
            return ResponseEntity.ok(userDetails);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error fetching user details: " + e.getMessage()));
        }
    }

    //Disable user account
    @PutMapping("/users/{userId}/disable")
    public ResponseEntity<Map<String, Object>> disableUserAccount(@PathVariable Long userId) {
        try {
            Optional<Users> userOpt = userRepo.findById(userId);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found"));
            }
            
            Users user = userOpt.get();
            user.setEnabled(false);
            userRepo.save(user);
            
            return ResponseEntity.ok(Map.of(
                "message", "User account disabled successfully",
                "userId", userId,
                "username", user.getUsername()
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error disabling user account: " + e.getMessage()));
        }
    }

    //Enable user account
    @PutMapping("/users/{userId}/enable")
    public ResponseEntity<Map<String, Object>> enableUserAccount(@PathVariable Long userId) {
        try {
            Optional<Users> userOpt = userRepo.findById(userId);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found"));
            }
            
            Users user = userOpt.get();
            user.setEnabled(true);
            userRepo.save(user);
            
            return ResponseEntity.ok(Map.of(
                "message", "User account enabled successfully",
                "userId", userId,
                "username", user.getUsername()
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error enabling user account: " + e.getMessage()));
        }
    }

    //testing
    @GetMapping
    public String hello(){
        return "test";
    }
}
