package com.capstone.HRMS.Service;

import com.capstone.HRMS.Entity.Role;
import com.capstone.HRMS.Entity.Users;
import com.capstone.HRMS.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmployeeService {
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    public Users saveEmployee(Users employee) {
        Optional<Users> existingEmployee = userRepo.findByUsername(employee.getUsername());

        if (existingEmployee.isPresent()) {
            throw new RuntimeException("Username already exists: " + employee.getUsername());
        }

        employee.setPassword(passwordEncoder.encode(employee.getPassword()));
        employee.setRole(Role.EMPLOYEE);
        return userRepo.save(employee);
    }
}
