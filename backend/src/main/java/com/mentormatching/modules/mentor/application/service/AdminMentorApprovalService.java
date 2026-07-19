package com.mentormatching.modules.mentor.application.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mentormatching.modules.mentor.application.dto.AdminMentorDetail;
import com.mentormatching.modules.mentor.application.dto.ReviewMentorApprovalCommand;
import com.mentormatching.modules.mentor.application.port.in.ReviewMentorApprovalUseCase;
import com.mentormatching.modules.mentor.application.port.out.MentorProfileRepositoryPort;
import com.mentormatching.modules.mentor.application.port.out.MentorReadRepositoryPort;
import com.mentormatching.modules.mentor.application.port.out.MentorVerificationRepositoryPort;
import com.mentormatching.modules.mentor.domain.MentorProfile;
import com.mentormatching.modules.mentor.domain.MentorVerification;
import com.mentormatching.modules.mentor.domain.MentorVerificationStatus;
import com.mentormatching.shared.exception.InvalidDataException;
import com.mentormatching.shared.exception.ResourceNotFoundException;

@Service
public class AdminMentorApprovalService implements ReviewMentorApprovalUseCase {

    private final MentorProfileRepositoryPort mentorProfileRepositoryPort;
    private final MentorReadRepositoryPort mentorReadRepositoryPort;
    private final MentorVerificationRepositoryPort mentorVerificationRepositoryPort;

    public AdminMentorApprovalService(MentorProfileRepositoryPort mentorProfileRepositoryPort,
                                      MentorReadRepositoryPort mentorReadRepositoryPort,
                                      MentorVerificationRepositoryPort mentorVerificationRepositoryPort) {
        this.mentorProfileRepositoryPort = mentorProfileRepositoryPort;
        this.mentorReadRepositoryPort = mentorReadRepositoryPort;
        this.mentorVerificationRepositoryPort = mentorVerificationRepositoryPort;
    }

    @Override
    @Transactional
    public AdminMentorDetail reviewMentorApproval(ReviewMentorApprovalCommand command) {
        MentorProfile mentorProfile = mentorProfileRepositoryPort.findById(command.mentorId())
                .orElseThrow(() -> new ResourceNotFoundException("Mentor profile not found"));

        switch (command.action()) {
            case APPROVE -> {
                ensureVerificationApproved(mentorProfile.getId());
                mentorProfile.approve(command.adminUserId(), command.approvalNote());
            }
            case REJECT -> mentorProfile.reject(command.approvalNote());
            case SUSPEND -> mentorProfile.suspend(command.approvalNote());
            case REACTIVATE -> mentorProfile.reactivate();
        }

        mentorProfileRepositoryPort.save(mentorProfile);
        return mentorReadRepositoryPort.findAdminMentorDetailById(mentorProfile.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Mentor profile not found"));
    }

    private void ensureVerificationApproved(Long mentorId) {
        MentorVerification verification = mentorVerificationRepositoryPort.findByMentorId(mentorId)
                .orElseThrow(() -> new InvalidDataException("Mentor verification must be verified before approval"));
        if (verification.getVerificationStatus() != MentorVerificationStatus.VERIFIED) {
            throw new InvalidDataException("Mentor verification must be verified before approval");
        }
    }
}
