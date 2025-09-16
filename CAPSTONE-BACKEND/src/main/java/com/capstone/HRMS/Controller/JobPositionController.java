package com.capstone.HRMS.Controller;

import com.capstone.HRMS.Entity.JobPosition;
import com.capstone.HRMS.Service.JobPositionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-positions")
@CrossOrigin(origins = "${frontend.url}")
public class JobPositionController {

    private final JobPositionService jobPositionService;

    public JobPositionController(JobPositionService jobPositionService) {
        this.jobPositionService = jobPositionService;
    }

    @PostMapping("/add")
    public ResponseEntity<JobPosition> createJobPosition(@RequestBody JobPosition jobPosition) {
        JobPosition savedPosition = jobPositionService.addJobPosition(jobPosition);
        return new ResponseEntity<>(savedPosition, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<JobPosition>> getAllJobPositions() {
        return ResponseEntity.ok(jobPositionService.getAllJobPositions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobPosition> getJobPositionById(@PathVariable Long id) {
        return ResponseEntity.ok(jobPositionService.getJobPositionById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobPosition> updateJobPosition(@PathVariable Long id, @RequestBody JobPosition jobPosition) {
        return ResponseEntity.ok(jobPositionService.updateJobPosition(id, jobPosition));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJobPosition(@PathVariable Long id) {
        jobPositionService.deleteJobPosition(id);
        return ResponseEntity.noContent().build();
    }
}
