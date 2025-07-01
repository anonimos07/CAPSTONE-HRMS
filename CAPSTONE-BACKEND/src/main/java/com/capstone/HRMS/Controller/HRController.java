package com.capstone.HRMS.Controller;

import com.capstone.HRMS.Entity.Role;
import com.capstone.HRMS.Entity.Users;
import com.capstone.HRMS.Repository.UserRepo;
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

        Map<String, Object> response = new HashMap<>();
        response.put("token", result);
        response.put("role", dbHr.getRole().name());
        response.put("username", dbHr.getUsername());
        response.put("userId", dbHr.getUserId());

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

    //testing
    @GetMapping
    public String hello(){
        return "test";
    }
}
