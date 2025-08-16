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
    public Optional<Timelog> getTimelogById(Long id) {
        return timelogRepository.findById(id);
    }
}
