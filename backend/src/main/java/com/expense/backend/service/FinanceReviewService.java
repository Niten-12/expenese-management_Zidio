package com.expense.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.expense.backend.exception.ResourceNotFoundException;
import com.expense.backend.model.ManagerExpenseRow;
import com.expense.backend.model.ManagerExpenseSubmission;
import com.expense.backend.model.RowStatus;
import com.expense.backend.model.SubmissionStatus;
import com.expense.backend.payload.RowReviewRequest;
import com.expense.backend.repository.ManagerExpenseRowRepository;
import com.expense.backend.repository.ManagerExpenseSubmissionRepository;

@Service
public class FinanceReviewService {

    @Autowired
    private ManagerExpenseRowRepository rowRepository;

    @Autowired
    private ManagerExpenseSubmissionRepository submissionRepository;

    /**
     * 🔄 Review a specific row (Approve / Reject).
     */
    @Transactional
    public void reviewRow(RowReviewRequest request) {
        ManagerExpenseRow row = rowRepository.findById(request.getRowId())
                .orElseThrow(() -> new ResourceNotFoundException("Row not found with ID: " + request.getRowId()));

        if (request.getStatus() != RowStatus.APPROVED && request.getStatus() != RowStatus.REJECTED_FINANCE) {
            throw new IllegalArgumentException("Invalid status for Finance review.");
        }

        row.setStatus(request.getStatus());
        row.setReviewedBy(request.getReviewerName());
        row.setReviewerRole(request.getReviewerRole());
        row.setComment(request.getComment());
        rowRepository.save(row);

        updateSubmissionStatusIfComplete(row.getSubmission().getId());
    }

    /**
     * 📈 Evaluate if all rows are reviewed and escalate submission status.
     */
    @Transactional
    public void updateSubmissionStatusIfComplete(Long submissionId) {
        ManagerExpenseSubmission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with ID: " + submissionId));

        List<ManagerExpenseRow> rows = rowRepository.findBySubmissionId(submissionId);

        boolean allReviewed = rows.stream().allMatch(
                row -> row.getStatus() == RowStatus.APPROVED || row.getStatus() == RowStatus.REJECTED_FINANCE);

        if (!allReviewed)
            return;

        boolean allApproved = rows.stream().allMatch(row -> row.getStatus() == RowStatus.APPROVED);

        if (allApproved) {
            submission.setStatus(SubmissionStatus.REVIEW_ADMIN);
        } else {
            submission.setStatus(SubmissionStatus.PARTIALLY_APPROVED_BY_FINANCE);
        }

        submissionRepository.save(submission);
    }
}
