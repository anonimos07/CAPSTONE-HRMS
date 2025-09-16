package com.capstone.HRMS.Controller;

import com.capstone.HRMS.Entity.Position;
import com.capstone.HRMS.Service.PositionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/position")
@CrossOrigin(origins = "${frontend.url}")
public class PositionController {

    private final PositionService positionService;

    public PositionController(PositionService positionService) {
        this.positionService = positionService;
    }

    @PostMapping("/add")
    public ResponseEntity<Position> createPosition(@RequestBody Position position) {
        Position savedPosition = positionService.addPosition(position);
        return new ResponseEntity<>(savedPosition, HttpStatus.CREATED);
    }

    @GetMapping("/getPositions")
    public ResponseEntity<List<Position>> getPositions() {
        return ResponseEntity.ok(positionService.getAllPositions());
    }
}
