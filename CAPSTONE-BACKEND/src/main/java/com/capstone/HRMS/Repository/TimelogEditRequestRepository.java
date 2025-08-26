package com.capstone.HRMS.Repository;

import com.capstone.HRMS.Entity.TimelogEditRequest;
import com.capstone.HRMS.Entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimelogEditRequestRepository extends JpaRepository<TimelogEditRequest, Long> {

    // Find requests by employee
    List<TimelogEditRequest> findByEmployeeOrderByCreatedDateDesc(Users employee);

    // Find requests assigned to HR
    List<TimelogEditRequest> findByAssignedHrOrderByCreatedDateDesc(Users assignedHr);

    // Find pending requests by HR
    @Query("SELECT r FROM TimelogEditRequest r WHERE r.assignedHr = :hr AND r.status = 'PENDING' ORDER BY r.createdDate DESC")
    List<TimelogEditRequest> findPendingRequestsByHr(@Param("hr") Users hr);

    // Find all pending requests
    @Query("SELECT r FROM TimelogEditRequest r WHERE r.status = 'PENDING' ORDER BY r.createdDate DESC")
    List<TimelogEditRequest> findAllPendingRequests();

    // Find requests by status
    List<TimelogEditRequest> findByStatusOrderByCreatedDateDesc(TimelogEditRequest.RequestStatus status);

    // Count pending requests for HR
    @Query("SELECT COUNT(r) FROM TimelogEditRequest r WHERE r.assignedHr = :hr AND r.status = 'PENDING'")
    Long countPendingRequestsByHr(@Param("hr") Users hr);
}
