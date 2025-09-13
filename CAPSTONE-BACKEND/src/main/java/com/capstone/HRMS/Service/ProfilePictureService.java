package com.capstone.HRMS.Service;

import com.capstone.HRMS.Entity.EmployeeDetails;
import com.capstone.HRMS.Entity.Users;
import com.capstone.HRMS.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ProfilePictureService {

    @Autowired
    private UserRepo userRepo;

    // Default SVG as Base64 data URL
    private final String defaultProfilePicture = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNGM0Y0RjYiLz4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjM3IiByPSIxOCIgZmlsbD0iIzlDQTNBRiIvPgogIDxwYXRoIGQ9Ik0yMCA4MEMyMCA2OS41MDY2IDI4LjUwNjYgNjEgMzkgNjFINjFDNzEuNDkzNCA2MSA4MCA2OS41MDY2IDgwIDgwVjEwMEgyMFY4MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";

    public String uploadProfilePicture(String username, MultipartFile file) throws IOException {
        // Validate file
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("File must be an image");
        }

        // Validate file size (max 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new RuntimeException("File size must be less than 5MB");
        }

        // Convert file to Base64
        byte[] fileBytes = file.getBytes();
        String base64Image = Base64.getEncoder().encodeToString(fileBytes);
        String dataUrl = "data:" + contentType + ";base64," + base64Image;

        // Update user profile picture in database
        Optional<Users> userOpt = userRepo.findByUsername(username);
        if (userOpt.isPresent()) {
            Users user = userOpt.get();
            EmployeeDetails employeeDetails = user.getEmployeeDetails();
            
            if (employeeDetails == null) {
                employeeDetails = new EmployeeDetails();
                employeeDetails.setUser(user);
            }
            
            employeeDetails.setProfilePicture(dataUrl);
            userRepo.save(user);
        } else {
            throw new RuntimeException("User not found");
        }

        return dataUrl;
    }

    public String getProfilePictureUrl(String username) {
        Optional<Users> userOpt = userRepo.findByUsername(username);
        if (userOpt.isPresent()) {
            Users user = userOpt.get();
            EmployeeDetails employeeDetails = user.getEmployeeDetails();
            
            if (employeeDetails != null && employeeDetails.getProfilePicture() != null) {
                return employeeDetails.getProfilePicture();
            }
        }
        return defaultProfilePicture;
    }

    public void resetToDefaultProfilePicture(String username) {
        Optional<Users> userOpt = userRepo.findByUsername(username);
        if (userOpt.isPresent()) {
            Users user = userOpt.get();
            EmployeeDetails employeeDetails = user.getEmployeeDetails();
            
            if (employeeDetails != null) {
                employeeDetails.setProfilePicture(defaultProfilePicture);
                userRepo.save(user);
            }
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public Map<String, String> getAllUsersProfilePictures() {
        List<Users> allUsers = userRepo.findAll();
        Map<String, String> profilePictures = new HashMap<>();
        
        for (Users user : allUsers) {
            String profilePictureUrl = defaultProfilePicture;
            
            EmployeeDetails employeeDetails = user.getEmployeeDetails();
            if (employeeDetails != null && employeeDetails.getProfilePicture() != null) {
                profilePictureUrl = employeeDetails.getProfilePicture();
            }
            
            profilePictures.put(String.valueOf(user.getUserId()), profilePictureUrl);
        }
        
        return profilePictures;
    }
}
