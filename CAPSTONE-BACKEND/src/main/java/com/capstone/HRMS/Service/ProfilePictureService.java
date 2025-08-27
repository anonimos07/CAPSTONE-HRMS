package com.capstone.HRMS.Service;

import com.capstone.HRMS.Entity.EmployeeDetails;
import com.capstone.HRMS.Entity.Users;
import com.capstone.HRMS.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProfilePictureService {

    @Autowired
    private UserRepo userRepo;

    private final String uploadDir = "src/main/resources/static/profile-pictures/";
    private final String defaultProfilePicture = "default-profile.png";

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

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

        // Save file
        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Update user profile picture in database
        Optional<Users> userOpt = userRepo.findByUsername(username);
        if (userOpt.isPresent()) {
            Users user = userOpt.get();
            EmployeeDetails employeeDetails = user.getEmployeeDetails();
            
            if (employeeDetails == null) {
                employeeDetails = new EmployeeDetails();
                employeeDetails.setUser(user);
            }
            
            // Delete old profile picture if it's not the default
            if (employeeDetails.getProfilePicture() != null && 
                !employeeDetails.getProfilePicture().equals(defaultProfilePicture)) {
                try {
                    Path oldFilePath = Paths.get(uploadDir + employeeDetails.getProfilePicture());
                    Files.deleteIfExists(oldFilePath);
                } catch (IOException e) {
                    // Log error but don't fail the upload
                    System.err.println("Failed to delete old profile picture: " + e.getMessage());
                }
            }
            
            employeeDetails.setProfilePicture("profile-pictures/" + uniqueFilename);
            userRepo.save(user);
        } else {
            throw new RuntimeException("User not found");
        }

        return "profile-pictures/" + uniqueFilename;
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
                // Delete current profile picture if it's not the default
                if (employeeDetails.getProfilePicture() != null && 
                    !employeeDetails.getProfilePicture().equals(defaultProfilePicture)) {
                    try {
                        Path oldFilePath = Paths.get("src/main/resources/static/" + employeeDetails.getProfilePicture());
                        Files.deleteIfExists(oldFilePath);
                    } catch (IOException e) {
                        System.err.println("Failed to delete profile picture: " + e.getMessage());
                    }
                }
                
                employeeDetails.setProfilePicture(null);
                userRepo.save(user);
            }
        } else {
            throw new RuntimeException("User not found");
        }
    }
}
