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
public class HRService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    public Users saveHr(Users hr) {
        // Check if username already exists
        Optional<Users> existingHr = userRepo.findByUsername(hr.getUsername());

        if (existingHr.isPresent()) {
            throw new RuntimeException("Username already exists: " + hr.getUsername());
        }

        hr.setPassword(passwordEncoder.encode(hr.getPassword()));
        hr.setRole(Role.HR);
        return userRepo.save(hr);
    }
}
