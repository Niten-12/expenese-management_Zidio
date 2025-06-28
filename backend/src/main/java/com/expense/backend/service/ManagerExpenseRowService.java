//ManagerExpenseRowService
package com.expense.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.expense.backend.model.ManagerExpenseRow;
import com.expense.backend.model.ManagerExpenseSubmission;
import com.expense.backend.model.RowStatus;
import com.expense.backend.model.SubmissionStatus;
import com.expense.backend.repository.ManagerExpenseRowRepository;
import com.expense.backend.repository.ManagerExpenseSubmissionRepository;

import jakarta.transaction.Transactional;

@Service
public class ManagerExpenseRowService {

    @Autowired
    private ManagerExpenseRowRepository rowRepository;

    @Autowired
    private ManagerExpenseSubmissionRepository submissionRepository;

    /**
     * Fetch all rows belonging to a specific submission.
     */
    public List<ManagerExpenseRow> getRowsBySubmissionId(Long submissionId) {
        return rowRepository.findBySubmissionId(submissionId);
    }

    /**
     * Fetch rows by submission + specific row status (used by Finance/Admin views).
     */
    public List<ManagerExpenseRow> getRowsBySubmissionIdAndStatus(Long submissionId, RowStatus status) {
        return rowRepository.findBySubmissionIdAndStatus(submissionId, status);
    }

    /**
     * Update the status of a single row (approve or reject).
     * Can be used by both Finance and Admin.
     */
    @Transactional
    public ManagerExpenseRow updateRowStatus(Long rowId, RowStatus newStatus) {
        ManagerExpenseRow row = rowRepository.findById(rowId)
                .orElseThrow(() -> new IllegalArgumentException("❌ Row not found with ID: " + rowId));

        row.setStatus(newStatus);
        return rowRepository.save(row);
    }

    /**
     * ✅ Updated: Re-evaluates submission-level status after rows are reviewed.
     */
    @Transactional
    public void updateSubmissionStatusIfComplete(Long submissionId) {
        List<ManagerExpenseRow> rows = rowRepository.findBySubmissionId(submissionId);

        ManagerExpenseSubmission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("❌ Submission not found"));

        // ✅ FIXED: Logic corrected to ensure REVIEW_ADMIN status triggers properly
        if (rows.stream().allMatch(row -> row.getStatus() == RowStatus.APPROVED ||
                row.getStatus() == RowStatus.REJECTED_FINANCE)) {

            // ✅ If finance has completed review of all rows
            submission.setStatus(SubmissionStatus.REVIEW_ADMIN);

        } else if (rows.stream().allMatch(row -> row.getStatus() == RowStatus.APPROVED)) {

            // ✅ Final state when both finance and admin fully approve
            submission.setStatus(SubmissionStatus.PROCESS_COMPLETED);

        } else if (rows.stream().anyMatch(row -> row.getStatus() == RowStatus.REJECTED_FINANCE)) {

            // 🟠 Some rejected by Finance
            submission.setStatus(SubmissionStatus.PARTIALLY_APPROVED_BY_FINANCE);

        } else if (rows.stream().anyMatch(row -> row.getStatus() == RowStatus.REJECTED_ADMIN)) {

            // 🔴 Some rejected by Admin
            submission.setStatus(SubmissionStatus.PARTIALLY_APPROVED_BY_ADMIN);
        }

        submissionRepository.save(submission);
    }
}

/**
 * // * Re-evaluates submission-level status after rows are reviewed.
 * //
 */
// @Transactional
// public void updateSubmissionStatusIfComplete(Long submissionId) {
// List<ManagerExpenseRow> rows =
// rowRepository.findBySubmissionId(submissionId);

// boolean allApproved = rows.stream().allMatch(r -> r.getStatus() ==
// RowStatus.APPROVED);

// boolean anyRejectedByFinance = rows.stream().anyMatch(r -> r.getStatus() ==
// RowStatus.REJECTED_FINANCE);

// boolean anyRejectedByAdmin = rows.stream().anyMatch(r -> r.getStatus() ==
// RowStatus.REJECTED_ADMIN);

// // 🔁 NEW: Add this block to promote to REVIEW_ADMIN
// boolean allFinanceReviewed = rows.stream().allMatch(
// r -> r.getStatus() == RowStatus.APPROVED || r.getStatus() ==
// RowStatus.REJECTED_FINANCE);
// ManagerExpenseSubmission submission =
// submissionRepository.findById(submissionId)
// .orElseThrow(() -> new IllegalArgumentException("❌ Submission not found"));

// // Transition logic
// // if (rows.stream().allMatch(r -> r.getStatus() == RowStatus.REVIEW_ADMIN ||
// // r.getStatus() == RowStatus.APPROVED ||
// // r.getStatus() == RowStatus.REJECTED_FINANCE)) {
// // submission.setStatus(SubmissionStatus.REVIEW_ADMIN);
// // }
// // if (allFinanceReviewed) {
// // submission.setStatus(SubmissionStatus.REVIEW_ADMIN);
// // }
// // if (allApproved) {
// // submission.setStatus(SubmissionStatus.PROCESS_COMPLETED);
// // }

// // if (anyRejectedByFinance && !allApproved) {
// // submission.setStatus(SubmissionStatus.PARTIALLY_APPROVED_BY_FINANCE);
// // }

// // if (anyRejectedByAdmin && !allApproved) {
// // submission.setStatus(SubmissionStatus.PARTIALLY_APPROVED_BY_ADMIN);
// // }
// if (rows.stream().allMatch(row -> row.getStatus() == RowStatus.APPROVED ||
// row.getStatus() == RowStatus.REJECTED_FINANCE)) {

// submission.setStatus(SubmissionStatus.REVIEW_ADMIN);

// } else if (rows.stream().allMatch(row -> row.getStatus() ==
// RowStatus.APPROVED)) {
// submission.setStatus(SubmissionStatus.PROCESS_COMPLETED);

// } else if (rows.stream().anyMatch(row -> row.getStatus() ==
// RowStatus.REJECTED_FINANCE)) {
// submission.setStatus(SubmissionStatus.PARTIALLY_APPROVED_BY_FINANCE);

// } else if (rows.stream().anyMatch(row -> row.getStatus() ==
// RowStatus.REJECTED_ADMIN)) {
// submission.setStatus(SubmissionStatus.PARTIALLY_APPROVED_BY_ADMIN);
// }
