package com.capstone.HRMS.Service;

import com.capstone.HRMS.Entity.Position;
import com.capstone.HRMS.Repository.PositionRepo;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PositionService {

    private final PositionRepo positionRepository;

    public PositionService(PositionRepo positionRepository) {
        this.positionRepository = positionRepository;
    }

    public Position addPosition(Position position) {
        if (positionRepository.findByTitle(position.getTitle()).isPresent()) {
            throw new RuntimeException("Position already exists: " + position.getTitle());
        }

        return positionRepository.save(position);
    }

    public List<Position> getAllPositions() {
        return positionRepository.findAll();
    }

    public Position getPositionById(Long id) {
        return positionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Position not found"));
    }
}
