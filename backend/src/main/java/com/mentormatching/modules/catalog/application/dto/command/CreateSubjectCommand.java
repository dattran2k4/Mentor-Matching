package com.mentormatching.modules.catalog.application.dto.command;

public record CreateSubjectCommand(Long categoryId, String name, String description) {
}
