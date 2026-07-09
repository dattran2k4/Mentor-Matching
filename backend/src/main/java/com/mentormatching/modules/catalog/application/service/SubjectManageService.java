package com.mentormatching.modules.catalog.application.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mentormatching.modules.catalog.application.dto.command.CreateSubjectCommand;
import com.mentormatching.modules.catalog.application.dto.command.UpdateSubjectCommand;
import com.mentormatching.modules.catalog.application.port.in.ManageSubjectUseCase;
import com.mentormatching.modules.catalog.application.port.out.CategoryRepositoryPort;
import com.mentormatching.modules.catalog.application.port.out.SubjectRepositoryPort;
import com.mentormatching.modules.catalog.domain.Subject;
import com.mentormatching.modules.catalog.domain.SubjectRestoreData;
import com.mentormatching.shared.exception.InvalidDataException;
import com.mentormatching.shared.exception.ResourceNotFoundException;

@Service
@Transactional
public class SubjectManageService implements ManageSubjectUseCase {

    private final SubjectRepositoryPort subjectRepositoryPort;
    private final CategoryRepositoryPort categoryRepositoryPort;

    public SubjectManageService(SubjectRepositoryPort subjectRepositoryPort, CategoryRepositoryPort categoryRepositoryPort) {
        this.subjectRepositoryPort = subjectRepositoryPort;
        this.categoryRepositoryPort = categoryRepositoryPort;
    }

    @Override
    public Subject createSubject(CreateSubjectCommand command) {
        if (command.name() == null || command.name().isBlank()) {
            throw new InvalidDataException("Subject name cannot be empty");
        }
        if (subjectRepositoryPort.existsByName(command.name().trim())) {
            throw new InvalidDataException("Subject name already exists");
        }
        categoryRepositoryPort.findById(command.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + command.categoryId()));

        LocalDateTime now = LocalDateTime.now();
        Subject newSubject = Subject.restore(new SubjectRestoreData(
                null,
                command.categoryId(),
                command.name().trim(),
                command.description() != null ? command.description().trim() : null,
                now,
                now
        ));

        return subjectRepositoryPort.save(newSubject);
    }

    @Override
    public Subject updateSubject(UpdateSubjectCommand command) {
        Subject existingSubject = subjectRepositoryPort.findById(command.id())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + command.id()));

        if (command.name() == null || command.name().isBlank()) {
            throw new InvalidDataException("Subject name cannot be empty");
        }
        
        if (!existingSubject.getName().equalsIgnoreCase(command.name().trim()) 
                && subjectRepositoryPort.existsByName(command.name().trim())) {
            throw new InvalidDataException("Subject name already exists");
        }

        categoryRepositoryPort.findById(command.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + command.categoryId()));

        Subject updatedSubject = Subject.restore(new SubjectRestoreData(
                existingSubject.getId(),
                command.categoryId(),
                command.name().trim(),
                command.description() != null ? command.description().trim() : null,
                existingSubject.getCreatedAt(),
                LocalDateTime.now()
        ));

        return subjectRepositoryPort.save(updatedSubject);
    }

    @Override
    public void deleteSubject(Long id) {
        if (subjectRepositoryPort.findById(id).isEmpty()) {
            throw new ResourceNotFoundException("Subject not found with id: " + id);
        }
        // TODO: In real system, check if Subject is referenced by MentorSubjects before hard delete
        subjectRepositoryPort.deleteById(id);
    }
}
