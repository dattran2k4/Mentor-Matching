package com.mentormatching.modules.catalog.application.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mentormatching.modules.catalog.application.dto.command.CreateGradeCommand;
import com.mentormatching.modules.catalog.application.dto.command.UpdateGradeCommand;
import com.mentormatching.modules.catalog.application.port.in.ManageGradeUseCase;
import com.mentormatching.modules.catalog.application.port.out.GradeRepositoryPort;
import com.mentormatching.modules.catalog.domain.Grade;
import com.mentormatching.modules.catalog.domain.GradeRestoreData;
import com.mentormatching.shared.exception.InvalidDataException;
import com.mentormatching.shared.exception.ResourceNotFoundException;

@Service
@Transactional
public class GradeManageService implements ManageGradeUseCase {

    private final GradeRepositoryPort gradeRepositoryPort;

    public GradeManageService(GradeRepositoryPort gradeRepositoryPort) {
        this.gradeRepositoryPort = gradeRepositoryPort;
    }

    @Override
    public Grade createGrade(CreateGradeCommand command) {
        if (command.name() == null || command.name().isBlank()) {
            throw new InvalidDataException("Grade name cannot be empty");
        }
        if (gradeRepositoryPort.existsByNameIgnoreCase(command.name().trim())) {
            throw new InvalidDataException("Grade name already exists");
        }
        if (command.levelGroup() == null) {
            throw new InvalidDataException("Level group is required");
        }

        LocalDateTime now = LocalDateTime.now();
        Grade newGrade = Grade.restore(new GradeRestoreData(
                null,
                command.name().trim(),
                command.levelGroup(),
                now,
                now
        ));

        return gradeRepositoryPort.save(newGrade);
    }

    @Override
    public Grade updateGrade(UpdateGradeCommand command) {
        Grade existingGrade = gradeRepositoryPort.findById(command.id())
                .orElseThrow(() -> new ResourceNotFoundException("Grade not found with id: " + command.id()));

        if (command.name() == null || command.name().isBlank()) {
            throw new InvalidDataException("Grade name cannot be empty");
        }
        if (command.levelGroup() == null) {
            throw new InvalidDataException("Level group is required");
        }
        
        if (!existingGrade.getName().equalsIgnoreCase(command.name().trim()) 
                && gradeRepositoryPort.existsByNameIgnoreCase(command.name().trim())) {
            throw new InvalidDataException("Grade name already exists");
        }

        Grade updatedGrade = Grade.restore(new GradeRestoreData(
                existingGrade.getId(),
                command.name().trim(),
                command.levelGroup(),
                existingGrade.getCreatedAt(),
                LocalDateTime.now()
        ));

        return gradeRepositoryPort.save(updatedGrade);
    }

    @Override
    public void deleteGrade(Long id) {
        if (gradeRepositoryPort.findById(id).isEmpty()) {
            throw new ResourceNotFoundException("Grade not found with id: " + id);
        }
        gradeRepositoryPort.deleteById(id);
    }
}
