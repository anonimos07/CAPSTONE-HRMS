package com.capstone.HRMS.Repository;

import com.capstone.HRMS.Entity.Timelog;
import com.capstone.HRMS.Entity.TimelogStatus;
import com.capstone.HRMS.Entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TimelogRepository extends JpaRepository<Timelog, Long> {

    // Find current active timelog for a user (not clocked out)
    @Query("SELECT t FROM Timelog t WHERE t.user = :user AND t.status != 'CLOCKED_OUT' ORDER BY t.createdDate DESC")
    Optional<Timelog> findActiveTimelogByUser(@Param("user") Users user);

    // Find today's timelog for a user
    @Query("SELECT t FROM Timelog t WHERE t.user = :user AND CAST(t.logDate AS date) = CAST(:date AS date)")
    Optional<Timelog> findTodayTimelogByUser(@Param("user") Users user, @Param("date") LocalDateTime date);

    // Find all timelogs for a user within a date range
    @Query("SELECT t FROM Timelog t WHERE t.user = :user AND t.logDate BETWEEN :startDate AND :endDate ORDER BY t.logDate DESC")
    List<Timelog> findTimelogsByUserAndDateRange(@Param("user") Users user, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // Find all timelogs for a user
    List<Timelog> findByUserOrderByLogDateDesc(Users user);

    // Find timelogs by status
    List<Timelog> findByStatus(TimelogStatus status);

    // Find timelogs that need adjustment (for HR dashboard)
    @Query("SELECT t FROM Timelog t WHERE t.adjustedBy IS NOT NULL ORDER BY t.adjustmentDate DESC")
    List<Timelog> findAdjustedTimelogs();

    // Find incomplete timelogs (clocked in but not clocked out)
    @Query("SELECT t FROM Timelog t WHERE t.timeIn IS NOT NULL AND t.timeOut IS NULL")
    List<Timelog> findIncompleteTimelogs();

    // Find timelogs for a specific date
    @Query("SELECT t FROM Timelog t WHERE CAST(t.logDate AS date) = CAST(:date AS date) ORDER BY t.createdDate DESC")
    List<Timelog> findTimelogsByDate(@Param("date") LocalDateTime date);

    // Calculate total worked hours for a user in a date range
    @Query("SELECT SUM(t.totalWorkedHours) FROM Timelog t WHERE t.user = :user AND t.logDate BETWEEN :startDate AND :endDate AND t.totalWorkedHours IS NOT NULL")
    Double calculateTotalWorkedHours(@Param("user") Users user, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // Find users who are currently clocked in
    @Query("SELECT DISTINCT t.user FROM Timelog t WHERE t.status = 'CLOCKED_IN'")
    List<Users> findUsersCurrentlyClockedIn();

    // Find users who are currently on break
    @Query("SELECT DISTINCT t.user FROM Timelog t WHERE t.status = 'ON_BREAK'")
    List<Users> findUsersCurrentlyOnBreak();

    // Find all timelogs (for admin/HR view)
    @Query("SELECT t FROM Timelog t ORDER BY t.logDate DESC")
    List<Timelog> findAllTimelogs();

    // Find timelogs by user and month
    @Query("SELECT t FROM Timelog t WHERE t.user = :user AND EXTRACT(YEAR FROM t.logDate) = :year AND EXTRACT(MONTH FROM t.logDate) = :month ORDER BY t.logDate DESC")
    List<Timelog> findTimelogsByUserAndMonth(@Param("user") Users user, @Param("year") int year, @Param("month") int month);

    // Find timelogs with search functionality (by username or full name) - search only
    @Query("SELECT t FROM Timelog t LEFT JOIN t.user.employeeDetails ed WHERE " +
           "(LOWER(t.user.username) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(COALESCE(ed.firstName, '')) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(COALESCE(ed.lastName, '')) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY t.logDate DESC")
    List<Timelog> findTimelogsBySearch(@Param("search") String search);

    // Find timelogs with search functionality and date range
    @Query("SELECT t FROM Timelog t LEFT JOIN t.user.employeeDetails ed WHERE " +
           "(LOWER(t.user.username) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(COALESCE(ed.firstName, '')) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(COALESCE(ed.lastName, '')) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND t.logDate >= :startDate AND t.logDate <= :endDate " +
           "ORDER BY t.logDate DESC")
    List<Timelog> findTimelogsWithSearchAndDateRange(@Param("search") String search, 
                                                    @Param("startDate") LocalDateTime startDate, 
                                                    @Param("endDate") LocalDateTime endDate);

    // Find timelogs with search functionality and start date only
    @Query("SELECT t FROM Timelog t LEFT JOIN t.user.employeeDetails ed WHERE " +
           "(LOWER(t.user.username) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(COALESCE(ed.firstName, '')) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(COALESCE(ed.lastName, '')) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND t.logDate >= :startDate " +
           "ORDER BY t.logDate DESC")
    List<Timelog> findTimelogsWithSearchAndStartDate(@Param("search") String search, 
                                                    @Param("startDate") LocalDateTime startDate);

    // Find timelogs with search functionality and end date only
    @Query("SELECT t FROM Timelog t LEFT JOIN t.user.employeeDetails ed WHERE " +
           "(LOWER(t.user.username) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(COALESCE(ed.firstName, '')) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(COALESCE(ed.lastName, '')) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND t.logDate <= :endDate " +
           "ORDER BY t.logDate DESC")
    List<Timelog> findTimelogsWithSearchAndEndDate(@Param("search") String search, 
                                                  @Param("endDate") LocalDateTime endDate);

    // Find timelogs by date range only - both dates
    @Query("SELECT t FROM Timelog t WHERE " +
           "t.logDate >= :startDate AND t.logDate <= :endDate " +
           "ORDER BY t.logDate DESC")
    List<Timelog> findTimelogsByDateRange(@Param("startDate") LocalDateTime startDate, 
                                        @Param("endDate") LocalDateTime endDate);

    // Find timelogs by start date only
    @Query("SELECT t FROM Timelog t WHERE t.logDate >= :startDate ORDER BY t.logDate DESC")
    List<Timelog> findTimelogsByStartDate(@Param("startDate") LocalDateTime startDate);

    // Find timelogs by end date only
    @Query("SELECT t FROM Timelog t WHERE t.logDate <= :endDate ORDER BY t.logDate DESC")
    List<Timelog> findTimelogsByEndDate(@Param("endDate") LocalDateTime endDate);
}
