package com.capstone.HRMS.Service;

import com.capstone.HRMS.Entity.*;
import com.capstone.HRMS.Repository.TimelogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TimelogService {

    @Autowired
    private TimelogRepository timelogRepository;


    // Clock in with photo
    public Timelog clockIn(Users user, String photoBase64) {
        // Check if user is already clocked in
        Optional<Timelog> activeTimelog = timelogRepository.findActiveTimelogByUser(user);
        if (activeTimelog.isPresent()) {
            throw new RuntimeException("User is already clocked in or on break");
        }

        // Check if there's already a timelog for today
        Optional<Timelog> todayTimelog = timelogRepository.findTodayTimelogByUser(user, LocalDateTime.now());
        
        Timelog timelog;
        if (todayTimelog.isPresent()) {
            // Update existing timelog for today
            timelog = todayTimelog.get();
            timelog.setTimeIn(LocalDateTime.now());
            timelog.setTimeInPhoto(photoBase64);
            timelog.setStatus(TimelogStatus.CLOCKED_IN);
        } else {
            // Create new timelog for today
            timelog = new Timelog(user, LocalDateTime.now());
            timelog.setTimeIn(LocalDateTime.now());
            timelog.setTimeInPhoto(photoBase64);
            timelog.setStatus(TimelogStatus.CLOCKED_IN);
        }

        timelog.setUpdatedDate(LocalDateTime.now());
        return timelogRepository.save(timelog);
    }

    // Clock out with photo
    public Timelog clockOut(Users user, String photoBase64) {
        Optional<Timelog> activeTimelog = timelogRepository.findActiveTimelogByUser(user);
        if (!activeTimelog.isPresent()) {
            throw new RuntimeException("User is not currently clocked in");
        }

        Timelog timelog = activeTimelog.get();
        if (timelog.getTimeIn() == null) {
            throw new RuntimeException("Cannot clock out without clocking in first");
        }

        timelog.setTimeOut(LocalDateTime.now());
        timelog.setTimeOutPhoto(photoBase64);
        timelog.setStatus(TimelogStatus.CLOCKED_OUT);

        // If user was on break, end the break
        if (timelog.getBreakTimeStart() != null && timelog.getBreakTimeEnd() == null) {
            timelog.setBreakTimeEnd(LocalDateTime.now());
            timelog.calculateBreakDuration();
        }

        // Calculate total worked hours
        timelog.updateTotalWorkedHours();
        
        return timelogRepository.save(timelog);
    }

    // Start break
    public Timelog startBreak(Users user) {
        Optional<Timelog> activeTimelog = timelogRepository.findActiveTimelogByUser(user);
        if (!activeTimelog.isPresent()) {
            throw new RuntimeException("User is not currently clocked in");
        }

        Timelog timelog = activeTimelog.get();
        if (timelog.getStatus() == TimelogStatus.ON_BREAK) {
            throw new RuntimeException("User is already on break");
        }

        if (timelog.getTimeIn() == null) {
            throw new RuntimeException("Cannot start break without clocking in first");
        }

        timelog.setBreakTimeStart(LocalDateTime.now());
        timelog.setStatus(TimelogStatus.ON_BREAK);
        timelog.setUpdatedDate(LocalDateTime.now());

        return timelogRepository.save(timelog);
    }

    // End break
    public Timelog endBreak(Users user) {
        Optional<Timelog> activeTimelog = timelogRepository.findActiveTimelogByUser(user);
        if (!activeTimelog.isPresent()) {
            throw new RuntimeException("User is not currently on break");
        }

        Timelog timelog = activeTimelog.get();
        if (timelog.getStatus() != TimelogStatus.ON_BREAK) {
            throw new RuntimeException("User is not currently on break");
        }

        if (timelog.getBreakTimeStart() == null) {
            throw new RuntimeException("Cannot end break without starting break first");
        }

        timelog.setBreakTimeEnd(LocalDateTime.now());
        timelog.setStatus(TimelogStatus.CLOCKED_IN);
        timelog.calculateBreakDuration();
        timelog.setUpdatedDate(LocalDateTime.now());

        return timelogRepository.save(timelog);
    }

    // Get current user status
    public String getCurrentStatus(Users user) {
        Optional<Timelog> activeTimelog = timelogRepository.findActiveTimelogByUser(user);
        if (!activeTimelog.isPresent()) {
            return "CLOCKED_OUT";
        }
        return activeTimelog.get().getStatus().toString();
    }

    // Get current active timelog
    public Optional<Timelog> getCurrentTimelog(Users user) {
        return timelogRepository.findActiveTimelogByUser(user);
    }

    // Get today's timelog
    public Optional<Timelog> getTodayTimelog(Users user) {
        return timelogRepository.findTodayTimelogByUser(user, LocalDateTime.now());
    }

    // Get user timelogs for date range
    public List<Timelog> getUserTimelogs(Users user, LocalDateTime startDate, LocalDateTime endDate) {
        return timelogRepository.findTimelogsByUserAndDateRange(user, startDate, endDate);
    }

    // Get all user timelogs
    public List<Timelog> getAllUserTimelogs(Users user) {
        return timelogRepository.findByUserOrderByLogDateDesc(user);
    }

    // Calculate total worked hours for user in date range
    public Double calculateTotalWorkedHours(Users user, LocalDateTime startDate, LocalDateTime endDate) {
        Double total = timelogRepository.calculateTotalWorkedHours(user, startDate, endDate);
        return total != null ? total : 0.0;
    }

    // HR Adjustment methods
    public Timelog adjustTimelog(Long timelogId, Users hrUser, LocalDateTime adjustedTimeIn, 
                                LocalDateTime adjustedTimeOut, Long adjustedBreakDuration, String reason) {
        // Check if HR user has permission to adjust
        if (!canAdjustTimelogs(hrUser)) {
            throw new RuntimeException("User does not have permission to adjust timelogs");
        }

        Optional<Timelog> timelogOpt = timelogRepository.findById(timelogId);
        if (!timelogOpt.isPresent()) {
            throw new RuntimeException("Timelog not found");
        }

        Timelog timelog = timelogOpt.get();
        timelog.setAdjustedTimeIn(adjustedTimeIn);
        timelog.setAdjustedTimeOut(adjustedTimeOut);
        timelog.setAdjustedBreakDurationMinutes(adjustedBreakDuration);
        timelog.setAdjustmentReason(reason);
        timelog.setAdjustedBy(hrUser);
        timelog.setAdjustmentDate(LocalDateTime.now());
        timelog.setUpdatedDate(LocalDateTime.now());

        // Recalculate total worked hours with adjustments
        timelog.updateTotalWorkedHours();

        return timelogRepository.save(timelog);
    }

    // Check if user can adjust timelogs (HR or Admin with specific positions)
    private boolean canAdjustTimelogs(Users user) {
        if (user.getRole() == Role.ADMIN) {
            return true;
        }
        if (user.getRole() == Role.HR) {
            // Check if HR has specific position that allows adjustments
            Position position = user.getPosition();
            if (position != null) {
                String title = position.getTitle().toLowerCase();
                return title.contains("manager") || title.contains("supervisor") || 
                       title.contains("lead") || title.contains("director");
            }
        }
        return false;
    }

    // Get all timelogs (for HR/Admin dashboard)
    public List<Timelog> getAllTimelogs() {
        return timelogRepository.findAllTimelogs();
    }

    // Get adjusted timelogs
    public List<Timelog> getAdjustedTimelogs() {
        return timelogRepository.findAdjustedTimelogs();
    }

    // Get incomplete timelogs
    public List<Timelog> getIncompleteTimelogs() {
        return timelogRepository.findIncompleteTimelogs();
    }

    // Get users currently clocked in
    public List<Users> getUsersCurrentlyClockedIn() {
        return timelogRepository.findUsersCurrentlyClockedIn();
    }

    // Get users currently on break
    public List<Users> getUsersCurrentlyOnBreak() {
        return timelogRepository.findUsersCurrentlyOnBreak();
    }

    // Get timelogs for specific date
    public List<Timelog> getTimelogsForDate(LocalDateTime date) {
        return timelogRepository.findTimelogsByDate(date);
    }

    // Get monthly timelogs for user
    public List<Timelog> getMonthlyTimelogs(Users user, int year, int month) {
        return timelogRepository.findTimelogsByUserAndMonth(user, year, month);
    }

    // Delete timelog (admin only)
    public void deleteTimelog(Long timelogId, Users user) {
        if (user.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only administrators can delete timelogs");
        }
        timelogRepository.deleteById(timelogId);
    }

    // Get timelog by ID
    public Timelog getTimelogById(Long id) {
        return timelogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Timelog not found with ID: " + id));
    }

    // Get all timelogs with search functionality (HR/Admin)
    // Supports three search modes:
    // 1. Employee name only -> Show all records for that specific employee
    // 2. Date range only -> Show all employees' records within that date range  
    // 3. Employee name + date range -> Show specific employee's records within that date range
    public List<Timelog> getAllTimelogsWithSearch(String search, LocalDateTime startDate, LocalDateTime endDate) {
        try {
            List<Timelog> result;
            
            // Check if we have employee search
            if (search != null && !search.trim().isEmpty()) {
                // Check if we also have date range
                if (startDate != null && endDate != null) {
                    // Mode 3: Employee name + both dates
                    result = timelogRepository.findTimelogsWithSearchAndDateRange(search.trim(), startDate, endDate);
                } else if (startDate != null) {
                    // Mode 3: Employee name + start date only
                    result = timelogRepository.findTimelogsWithSearchAndStartDate(search.trim(), startDate);
                } else if (endDate != null) {
                    // Mode 3: Employee name + end date only
                    result = timelogRepository.findTimelogsWithSearchAndEndDate(search.trim(), endDate);
                } else {
                    // Mode 1: Employee name only
                    result = timelogRepository.findTimelogsBySearch(search.trim());
                }
            } 
            // Check if we only have date range (no employee search)
            else if (startDate != null || endDate != null) {
                if (startDate != null && endDate != null) {
                    // Mode 2: Both dates
                    result = timelogRepository.findTimelogsByDateRange(startDate, endDate);
                } else if (startDate != null) {
                    // Mode 2: Start date only
                    result = timelogRepository.findTimelogsByStartDate(startDate);
                } else {
                    // Mode 2: End date only
                    result = timelogRepository.findTimelogsByEndDate(endDate);
                }
            } 
            // No filters - return all timelogs
            else {
                result = timelogRepository.findAllTimelogs();
            }
            
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Failed to search timelogs: " + e.getMessage(), e);
        }
    }

    // Generate CSV content for timelogs
    public String generateTimelogsCSV(String search, LocalDateTime startDate, LocalDateTime endDate) {
        List<Timelog> timelogs = getAllTimelogsWithSearch(search, startDate, endDate);
        
        StringBuilder csv = new StringBuilder();
        // CSV Header
        csv.append("ID,Employee Name,Username,Date,Time In,Time Out,Break Start,Break End,Break Duration (mins),")
           .append("Total Hours,Adjusted Time In,Adjusted Time Out,Adjusted Break Duration,")
           .append("Adjustment Reason,Adjusted By,Adjustment Date,Status\n");
        
        // CSV Data
        for (Timelog timelog : timelogs) {
            csv.append(timelog.getId()).append(",")
               .append(escapeCSV(getEmployeeName(timelog.getUser()))).append(",")
               .append(escapeCSV(timelog.getUser().getUsername())).append(",")
               .append(timelog.getLogDate() != null ? timelog.getLogDate().toLocalDate() : "").append(",")
               .append(timelog.getTimeIn() != null ? timelog.getTimeIn() : "").append(",")
               .append(timelog.getTimeOut() != null ? timelog.getTimeOut() : "").append(",")
               .append(timelog.getBreakTimeStart() != null ? timelog.getBreakTimeStart() : "").append(",")
               .append(timelog.getBreakTimeEnd() != null ? timelog.getBreakTimeEnd() : "").append(",")
               .append(timelog.getBreakDurationMinutes() != null ? timelog.getBreakDurationMinutes() : "0").append(",")
               .append(timelog.getTotalWorkedHours() != null ? timelog.getTotalWorkedHours() : "0").append(",")
               .append(timelog.getAdjustedTimeIn() != null ? timelog.getAdjustedTimeIn() : "").append(",")
               .append(timelog.getAdjustedTimeOut() != null ? timelog.getAdjustedTimeOut() : "").append(",")
               .append(timelog.getAdjustedBreakDurationMinutes() != null ? timelog.getAdjustedBreakDurationMinutes() : "").append(",")
               .append(escapeCSV(timelog.getAdjustmentReason())).append(",")
               .append(timelog.getAdjustedBy() != null ? escapeCSV(timelog.getAdjustedBy().getUsername()) : "").append(",")
               .append(timelog.getAdjustmentDate() != null ? timelog.getAdjustmentDate() : "").append(",")
               .append(timelog.getStatus()).append("\n");
        }
        
        return csv.toString();
    }

    // Helper method to get employee name
    private String getEmployeeName(Users user) {
        if (user.getEmployeeDetails() != null) {
            String firstName = user.getEmployeeDetails().getFirstName();
            String lastName = user.getEmployeeDetails().getLastName();
            if (firstName != null && lastName != null) {
                return firstName + " " + lastName;
            } else if (firstName != null) {
                return firstName;
            } else if (lastName != null) {
                return lastName;
            }
        }
        return user.getUsername();
    }

    // Helper method to escape CSV values
    private String escapeCSV(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
}
