package com.capstone.HRMS.Service;

import com.capstone.HRMS.Entity.EmployeeDetails;
import com.capstone.HRMS.Entity.Position;
import com.capstone.HRMS.Entity.Role;
import com.capstone.HRMS.Entity.Users;
import com.capstone.HRMS.Repository.PositionRepo;
import com.capstone.HRMS.Repository.UserRepo;
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
public class HRService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final PositionRepo positionRepo;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtService jwtService;

    public Users saveHr(Users hr) {
        // Check if username already exists
        Optional<Users> existingHr = userRepo.findByUsername(hr.getUsername());

        if (existingHr.isPresent()) {
            throw new RuntimeException("Username already exists: " + hr.getUsername());
        }

        EmployeeDetails details = new EmployeeDetails();

        hr.setPassword(passwordEncoder.encode(hr.getPassword()));
        hr.setRole(Role.HR);
        hr.setEmployeeDetails(details);
        if (hr.getPosition() != null && hr.getPosition().getTitle() != null) {

            Position position = positionRepo.findByTitle(hr.getPosition().getTitle())
                    .orElseThrow(() -> new RuntimeException("Position not found with title: " + hr.getPosition().getTitle()));

            hr.setPosition(position);
        } else {
            throw new RuntimeException("Position title must be provided");
        }
        return userRepo.save(hr);
    }

    public String verify(Users hr, Role expectedRole) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(hr.getUsername(), hr.getPassword())
        );

        if (authentication.isAuthenticated()) {
            Optional<Users> foundHr = userRepo.findByUsername(hr.getUsername());

            if (foundHr.isPresent() && foundHr.get().getRole() == expectedRole) {
                return jwtService.generateToken(hr.getUsername());
            } else {
                return "unauthorized";
            }
        }
        return "failed";
    }
}
