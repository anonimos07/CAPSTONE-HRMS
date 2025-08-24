package com.capstone.HRMS.Repository;

import com.capstone.HRMS.Entity.LeaveBalance;
import com.capstone.HRMS.Entity.LeaveType;
import com.capstone.HRMS.Entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance, Long> {

    List<LeaveBalance> findByEmployeeAndYear(Users employee, Integer year);

    Optional<LeaveBalance> findByEmployeeAndLeaveTypeAndYear(Users employee, LeaveType leaveType, Integer year);

    @Query("SELECT lb FROM LeaveBalance lb WHERE lb.employee = :employee AND lb.year = :year")
    List<LeaveBalance> findEmployeeBalancesByYear(@Param("employee") Users employee, @Param("year") Integer year);

    @Query("SELECT SUM(lb.remainingDays) FROM LeaveBalance lb WHERE lb.employee = :employee AND lb.year = :year")
    Integer getTotalRemainingDays(@Param("employee") Users employee, @Param("year") Integer year);
}
