package com.capstone.HRMS.Controller;

import com.capstone.HRMS.Entity.Role;
import com.capstone.HRMS.Entity.Users;
import com.capstone.HRMS.Repository.UserRepo;
import com.capstone.HRMS.Service.AdminService;
import com.capstone.HRMS.Service.EmployeeService;
import com.capstone.HRMS.Service.HRService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final HRService hrService;
    private final EmployeeService employeeService;
    private final UserRepo userRepo;



    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Users loginRequest) {
        String result = adminService.verify(loginRequest, Role.ADMIN);

        if (result.equals("failed") || result.equals("unauthorized")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("error", "Authentication failed"));
        }

        Optional<Users> dbAdminOpt = userRepo.findByUsername(loginRequest.getUsername());
        if (dbAdminOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("error", "Admin not found"));
        }

        Users dbAdmin = dbAdminOpt.get();
        

        if (!dbAdmin.isEnabled()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Collections.singletonMap("error", "Your account has been disabled"));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("token", result);
        response.put("role", dbAdmin.getRole().name());
        response.put("username", dbAdmin.getUsername());
        response.put("userId", dbAdmin.getUserId());

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

    //cr8 admin
    @PostMapping("/create-admin")
    public ResponseEntity<Map<String, Object>> createAdmin(@RequestBody Users admin) {
        try {
            // Set role to ADMIN and no position required
            admin.setRole(Role.ADMIN);
            admin.setPosition(null);
            
            adminService.saveAdmin(admin);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Admin created successfully");
            response.put("role", admin.getRole().name());
            response.put("username", admin.getUsername());
            response.put("userId", admin.getUserId());
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    //testing
    @GetMapping
    public String hello(){
        return "test";
    }
}
