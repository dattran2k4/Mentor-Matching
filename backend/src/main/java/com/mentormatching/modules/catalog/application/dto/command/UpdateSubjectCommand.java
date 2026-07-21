package com.mentormatching.modules.catalog.application.dto.command;

public record UpdateSubjectCommand(Long id, Long categoryId, String name, String description) {
}
