package com.capstone.HRMS.Service;

import com.capstone.HRMS.Entity.Role;
import com.capstone.HRMS.Entity.Users;
import com.capstone.HRMS.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsersService {

    @Autowired
    private UserRepo userRepo;

    public Users getUserById(Long id) {
        Optional<Users> user = userRepo.findById(id);
        return user.orElse(null);
    }

    public Users getUserByUsername(String username) {
        Optional<Users> user = userRepo.findByUsername(username);
        return user.orElse(null);
    }

    public List<Users> getAllUsers() {
        return userRepo.findAll();
    }

    public List<Users> getUsersByRole(Role role) {
        return userRepo.findByRole(role);
    }

    public Users saveUser(Users user) {
        return userRepo.save(user);
    }

    public boolean existsByUsername(String username) {
        return userRepo.existsByUsername(username);
    }

    public void deleteUser(Long id) {
        userRepo.deleteById(id);
    }
}
