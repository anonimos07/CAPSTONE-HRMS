package com.capstone.HRMS.Repository;

import com.capstone.HRMS.Entity.LeaveRequest;
import com.capstone.HRMS.Entity.LeaveStatus;
import com.capstone.HRMS.Entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    List<LeaveRequest> findByEmployeeOrderByCreatedAtDesc(Users employee);

    List<LeaveRequest> findByStatusOrderByCreatedAtDesc(LeaveStatus status);

    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.status = :status ORDER BY lr.createdAt DESC")
    List<LeaveRequest> findPendingRequestsForHR(@Param("status") LeaveStatus status);

    @Query("SELECT lr FROM LeaveRequest lr ORDER BY lr.createdAt DESC")
    List<LeaveRequest> findAllRequestsForHR();

    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.employee = :employee AND lr.status = :status")
    List<LeaveRequest> findByEmployeeAndStatus(@Param("employee") Users employee, @Param("status") LeaveStatus status);

    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.employee = :employee AND " +
           "((lr.startDate BETWEEN :startDate AND :endDate) OR " +
           "(lr.endDate BETWEEN :startDate AND :endDate) OR " +
           "(lr.startDate <= :startDate AND lr.endDate >= :endDate)) AND " +
           "lr.status IN ('PENDING', 'APPROVED')")
    List<LeaveRequest> findOverlappingLeaveRequests(@Param("employee") Users employee,
                                                   @Param("startDate") LocalDate startDate,
                                                   @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(lr) FROM LeaveRequest lr WHERE lr.status = 'PENDING'")
    long countPendingRequests();
}
