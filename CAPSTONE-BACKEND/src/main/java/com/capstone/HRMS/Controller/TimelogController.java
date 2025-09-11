package com.capstone.HRMS.Controller;

import com.capstone.HRMS.Entity.Timelog;
import com.capstone.HRMS.Entity.Users;
import com.capstone.HRMS.Service.TimelogService;
import com.capstone.HRMS.Service.UsersService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/timelog")
@CrossOrigin(origins = "*")
public class TimelogController {

    private static final Logger logger = LoggerFactory.getLogger(TimelogController.class);

    @Autowired
    private TimelogService timelogService;

    @Autowired
    private UsersService usersService;

    // Clock in endpoint
    @PostMapping("/time-in")
    public ResponseEntity<?> clockIn(@RequestBody Map<String, String> request, Authentication authentication) {
        try {
            String username = authentication.getName();
            Users user = usersService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            String photoBase64 = request.get("photo");
            if (photoBase64 == null || photoBase64.isEmpty()) {
                return ResponseEntity.badRequest().body("Photo is required for clock in");
            }

            Timelog timelog = timelogService.clockIn(user, photoBase64);
            return ResponseEntity.ok(timelog);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while clocking in");
        }
    }

    // Clock out endpoint
    @PostMapping("/time-out")
    public ResponseEntity<?> clockOut(@RequestBody Map<String, String> request, Authentication authentication) {
        try {
            String username = authentication.getName();
            Users user = usersService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            String photoBase64 = request.get("photo");
            if (photoBase64 == null || photoBase64.isEmpty()) {
                return ResponseEntity.badRequest().body("Photo is required for clock out");
            }

            Timelog timelog = timelogService.clockOut(user, photoBase64);
            return ResponseEntity.ok(timelog);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while clocking out");
        }
    }

    // Start break endpoint
    @PostMapping("/break/start")
    public ResponseEntity<?> startBreak(Authentication authentication) {
        try {
            String username = authentication.getName();
            Users user = usersService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            Timelog timelog = timelogService.startBreak(user);
            return ResponseEntity.ok(timelog);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while starting break");
        }
    }

    // End break endpoint
    @PostMapping("/break/end")
    public ResponseEntity<?> endBreak(Authentication authentication) {
        try {
            String username = authentication.getName();
            Users user = usersService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            Timelog timelog = timelogService.endBreak(user);
            return ResponseEntity.ok(timelog);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while ending break");
        }
    }

    // Get current status
    @GetMapping("/status")
    public ResponseEntity<?> getCurrentStatus(Authentication authentication) {
        try {
            String username = authentication.getName();
            logger.info("Getting status for user: {}", username);
            
            Users user = usersService.getUserByUsername(username);
            if (user == null) {
                logger.warn("User not found: {}", username);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            String status = timelogService.getCurrentStatus(user);
            Optional<Timelog> currentTimelog = timelogService.getCurrentTimelog(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", status);
            response.put("timelog", currentTimelog.orElse(null));
            
            logger.info("Status retrieved successfully for user: {}", username);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error getting status for user: {}", authentication.getName(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while getting status: " + e.getMessage());
        }
    }

    // Get today's timelog
    @GetMapping("/today")
    public ResponseEntity<?> getTodayTimelog(Authentication authentication) {
        try {
            String username = authentication.getName();
            logger.info("Getting today's timelog for user: {}", username);
            
            Users user = usersService.getUserByUsername(username);
            if (user == null) {
                logger.warn("User not found: {}", username);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            Optional<Timelog> todayTimelog = timelogService.getTodayTimelog(user);
            logger.info("Today's timelog retrieved successfully for user: {}", username);
            return ResponseEntity.ok(todayTimelog.orElse(null));
        } catch (Exception e) {
            logger.error("Error getting today's timelog for user: {}", authentication.getName(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while getting today's timelog: " + e.getMessage());
        }
    }

    // Get user timelogs for date range
    @GetMapping("/range")
    public ResponseEntity<?> getTimelogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            Users user = usersService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            List<Timelog> timelogs = timelogService.getUserTimelogs(user, startDate, endDate);
            return ResponseEntity.ok(timelogs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while getting timelogs");
        }
    }

    // Get all user timelogs
    @GetMapping("/user/all")
    public ResponseEntity<?> getAllUserTimelogs(Authentication authentication) {
        try {
            String username = authentication.getName();
            Users user = usersService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            List<Timelog> timelogs = timelogService.getAllUserTimelogs(user);
            return ResponseEntity.ok(timelogs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while getting user timelogs");
        }
    }

    // Calculate total worked hours for date range
    @GetMapping("/hours/total")
    public ResponseEntity<?> getTotalWorkedHours(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            Users user = usersService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            Double totalHours = timelogService.calculateTotalWorkedHours(user, startDate, endDate);
            return ResponseEntity.ok(Map.of("totalHours", totalHours));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while calculating total hours");
        }
    }

    // HR/Admin endpoints for adjustments and management
    @PostMapping("/adjust")
    public ResponseEntity<?> adjustTimelog(@RequestBody Map<String, Object> request, Authentication authentication) {
        try {
            String username = authentication.getName();
            Users hrUser = usersService.getUserByUsername(username);
            if (hrUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            Long timelogId = Long.valueOf(request.get("timelogId").toString());
            LocalDateTime adjustedTimeIn = request.get("adjustedTimeIn") != null ? 
                LocalDateTime.parse(request.get("adjustedTimeIn").toString()) : null;
            LocalDateTime adjustedTimeOut = request.get("adjustedTimeOut") != null ? 
                LocalDateTime.parse(request.get("adjustedTimeOut").toString()) : null;
            Long adjustedBreakDuration = request.get("adjustedBreakDuration") != null ? 
                Long.valueOf(request.get("adjustedBreakDuration").toString()) : null;
            String reason = request.get("reason").toString();

            Timelog adjustedTimelog = timelogService.adjustTimelog(timelogId, hrUser, adjustedTimeIn, 
                adjustedTimeOut, adjustedBreakDuration, reason);
            return ResponseEntity.ok(adjustedTimelog);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while adjusting timelog");
        }
    }

    // Get all timelogs (HR/Admin only)
    @GetMapping("/all")
    public ResponseEntity<?> getAllTimelogs(Authentication authentication) {
        try {
            String username = authentication.getName();
            Users user = usersService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            // Check if user has HR or Admin role
            if (user.getRole().name().equals("HR") || user.getRole().name().equals("ADMIN")) {
                List<Timelog> timelogs = timelogService.getAllTimelogs();
                return ResponseEntity.ok(timelogs);
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while getting all timelogs");
        }
    }

    // Get users currently clocked in
    @GetMapping("/users/clocked-in")
    public ResponseEntity<?> getUsersClockedIn(Authentication authentication) {
        try {
            String username = authentication.getName();
            Users user = usersService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            if (user.getRole().name().equals("HR") || user.getRole().name().equals("ADMIN")) {
                List<Users> users = timelogService.getUsersCurrentlyClockedIn();
                return ResponseEntity.ok(users);
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while getting clocked in users");
        }
    }

    // Get users currently on break
    @GetMapping("/users/on-break")
    public ResponseEntity<?> getUsersOnBreak(Authentication authentication) {
        try {
            String username = authentication.getName();
            Users user = usersService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            if (user.getRole().name().equals("HR") || user.getRole().name().equals("ADMIN")) {
                List<Users> users = timelogService.getUsersCurrentlyOnBreak();
                return ResponseEntity.ok(users);
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while getting users on break");
        }
    }

    // Get incomplete timelogs
    @GetMapping("/incomplete")
    public ResponseEntity<?> getIncompleteTimelogs(Authentication authentication) {
        try {
            String username = authentication.getName();
            Users user = usersService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            if (user.getRole().name().equals("HR") || user.getRole().name().equals("ADMIN")) {
                List<Timelog> timelogs = timelogService.getIncompleteTimelogs();
                return ResponseEntity.ok(timelogs);
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while getting incomplete timelogs");
        }
    }

    // Get monthly timelogs
    @GetMapping("/monthly")
    public ResponseEntity<?> getMonthlyTimelogs(
            @RequestParam int year,
            @RequestParam int month,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            Users user = usersService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            List<Timelog> timelogs = timelogService.getMonthlyTimelogs(user, year, month);
            return ResponseEntity.ok(timelogs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while getting monthly timelogs");
        }
    }

    // Delete timelog (Admin only)
    @DeleteMapping("/{timelogId}")
    public ResponseEntity<?> deleteTimelog(@PathVariable Long timelogId, Authentication authentication) {
        try {
            String username = authentication.getName();
            Users user = usersService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            timelogService.deleteTimelog(timelogId, user);
            return ResponseEntity.ok("Timelog deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting timelog");
        }
    }

    // Get all timelogs with search functionality (HR/Admin only)
    @GetMapping("/hr/all")
    public ResponseEntity<?> getAllTimelogsForHR(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) String startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) String endDate,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            logger.info("HR timelog request from user: {}, search: '{}', startDate: '{}', endDate: '{}'", 
                       username, search, startDate, endDate);
            
            Users user = usersService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            // Check if user has HR or Admin role
            if (!user.getRole().name().equals("HR") && !user.getRole().name().equals("ADMIN")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }

            // Convert date strings to LocalDateTime
            LocalDateTime startDateTime = null;
            LocalDateTime endDateTime = null;
            
            if (startDate != null && !startDate.trim().isEmpty()) {
                startDateTime = java.time.LocalDate.parse(startDate).atStartOfDay();
                logger.info("Parsed startDate: {} -> {}", startDate, startDateTime);
            }
            if (endDate != null && !endDate.trim().isEmpty()) {
                endDateTime = java.time.LocalDate.parse(endDate).atTime(23, 59, 59);
                logger.info("Parsed endDate: {} -> {}", endDate, endDateTime);
            }

            List<Timelog> timelogs = timelogService.getAllTimelogsWithSearch(search, startDateTime, endDateTime);
            logger.info("Found {} timelogs for HR request with search='{}', startDateTime={}, endDateTime={}", 
                       timelogs.size(), search, startDateTime, endDateTime);
            return ResponseEntity.ok(timelogs);
        } catch (Exception e) {
            logger.error("Error getting timelogs for HR: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while getting timelogs: " + e.getMessage());
        }
    }

    // Download timelogs as CSV (HR/Admin only)
    @GetMapping("/hr/download-csv")
    public ResponseEntity<?> downloadTimelogsCSV(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) String startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) String endDate,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            Users user = usersService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            // Check if user has HR or Admin role
            if (!user.getRole().name().equals("HR") && !user.getRole().name().equals("ADMIN")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }

            // Convert date strings to LocalDateTime
            LocalDateTime startDateTime = null;
            LocalDateTime endDateTime = null;
            
            if (startDate != null && !startDate.trim().isEmpty()) {
                startDateTime = java.time.LocalDate.parse(startDate).atStartOfDay();
            }
            if (endDate != null && !endDate.trim().isEmpty()) {
                endDateTime = java.time.LocalDate.parse(endDate).atTime(23, 59, 59);
            }

            String csvContent = timelogService.generateTimelogsCSV(search, startDateTime, endDateTime);
            
            return ResponseEntity.ok()
                    .header("Content-Type", "text/csv")
                    .header("Content-Disposition", "attachment; filename=timelogs.csv")
                    .body(csvContent);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while generating CSV");
        }
    }

    // Get single timelog by ID (HR/Admin only)
    @GetMapping("/hr/{timelogId}")
    public ResponseEntity<?> getTimelogById(@PathVariable Long timelogId, Authentication authentication) {
        try {
            String username = authentication.getName();
            Users user = usersService.getUserByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            // Check if user has HR or Admin role
            if (!user.getRole().name().equals("HR") && !user.getRole().name().equals("ADMIN")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }

            Timelog timelog = timelogService.getTimelogById(timelogId);
            return ResponseEntity.ok(timelog);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while getting timelog");
        }
    }
}
