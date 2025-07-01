package com.capstone.HRMS.Repository;

import com.capstone.HRMS.Entity.EmployeeDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.Optional;

@Repository
public interface EmpDetailsRepo extends JpaRepository<EmployeeDetails, Long> {

}
