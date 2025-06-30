package com.capstone.HRMS.Service;

import com.capstone.HRMS.Entity.Role;
import com.capstone.HRMS.Entity.Users;
import com.capstone.HRMS.Repository.UserRepo;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminService {

    public final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtService jwtService;

    @PostConstruct
    public void adminAcc() {
        String defUsername = "tsh.ADMIN";
        String defPass = "admin123";
        Role role = Role.ADMIN;

        if (!userRepo.existsByUsername(defUsername)) {
            Users admin = new Users();
            admin.setUsername(defUsername);
            admin.setPassword(passwordEncoder.encode(defPass));
            admin.setRole(Role.ADMIN);
            userRepo.save(admin);
            System.out.println("Default admin created with encoded password");
        }
    }

    public String verify(Users admin, Role expectedRole) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(admin.getUsername(), admin.getPassword())
        );

        if (authentication.isAuthenticated()) {
            Optional<Users> foundEmployee = userRepo.findByUsername(admin.getUsername());

            if (foundEmployee.isPresent() && foundEmployee.get().getRole() == expectedRole) {
                return jwtService.generateToken(admin.getUsername());
            } else {
                return "unauthorized";
            }
        }
        return "failed";
    }

}
