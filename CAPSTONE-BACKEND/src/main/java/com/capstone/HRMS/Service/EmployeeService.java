package com.capstone.HRMS.Service;

import com.capstone.HRMS.Entity.EmployeeDetails;
import com.capstone.HRMS.Entity.Role;
import com.capstone.HRMS.Entity.Users;
import com.capstone.HRMS.Repository.UserRepo;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmployeeService {
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtService jwtService;

    public Users saveEmployee(Users employee) {
        Optional<Users> existingEmployee = userRepo.findByUsername(employee.getUsername());

        if (existingEmployee.isPresent()) {
            throw new RuntimeException("Username already exists: " + employee.getUsername());
        }
        EmployeeDetails details = new EmployeeDetails();

        employee.setPassword(passwordEncoder.encode(employee.getPassword()));
        employee.setRole(Role.EMPLOYEE);
        employee.setEmployeeDetails(details);
        return userRepo.save(employee);
    }

    public String verify(Users employee, Role expectedRole) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(employee.getUsername(), employee.getPassword())
        );

        if (authentication.isAuthenticated()) {
            Optional<Users> foundEmployee = userRepo.findByUsername(employee.getUsername());

            if (foundEmployee.isPresent() && foundEmployee.get().getRole() == expectedRole) {
                return jwtService.generateToken(employee.getUsername());
            } else {
                return "unauthorized";
            }
        }
        return "failed";
    }

    public void updateOwnProfile(String username, EmployeeDetails updatedData) {
        Users employee = userRepo.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found for username: " + username));

        EmployeeDetails details = employee.getEmployeeDetails();

        if (details == null) {
            details = new EmployeeDetails();
            details.setUser(employee);
            employee.setEmployeeDetails(details);
        }


        if (updatedData.getFirstName() != null) {
            details.setFirstName(updatedData.getFirstName());
        }
        if (updatedData.getLastName() != null) {
            details.setLastName(updatedData.getLastName());
        }
        if (updatedData.getEmail() != null) {
            details.setEmail(updatedData.getEmail());
        }
        if (updatedData.getContact() != null) {
            details.setContact(updatedData.getContact());
        }
        if (updatedData.getDepartment() != null) {
            details.setDepartment(updatedData.getDepartment());
        }
        if (updatedData.getPosition() != null) {
            details.setPosition(updatedData.getPosition());
        }
        if (updatedData.getAddress() != null) {
            details.setAddress(updatedData.getAddress());
        }

        userRepo.save(employee);
    }

}
