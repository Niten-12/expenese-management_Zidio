//FinanceExpenseReviewController.java
package com.expense.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.expense.backend.model.ManagerExpenseRow;
import com.expense.backend.model.ManagerExpenseSubmission;
import com.expense.backend.model.RowStatus;
import com.expense.backend.model.SubmissionStatus;
import com.expense.backend.service.ManagerExpenseRowService;
import com.expense.backend.service.ManagerExpenseSubmissionService;

@RestController
@RequestMapping("/api/finance")
@PreAuthorize("hasRole('FINANCE')")
public class FinanceExpenseReviewController {

    @Autowired
    private ManagerExpenseSubmissionService submissionService;

    @Autowired
    private ManagerExpenseRowService rowService;

    /**
     * 🔄 Get all submissions currently under REVIEW_FINANCE.
     */
    @GetMapping("/pending-submissions")
    public ResponseEntity<List<ManagerExpenseSubmission>> getPendingSubmissions() {
        List<ManagerExpenseSubmission> list = submissionService.getSubmissionsByStatus(SubmissionStatus.REVIEW_FINANCE);
        return ResponseEntity.ok(list);
    }

    /**
     * 📄 Get all expense rows under a submission.
     */
    @GetMapping("/submission/{submissionId}/rows")
    public ResponseEntity<List<ManagerExpenseRow>> getRowsForSubmission(@PathVariable Long submissionId) {
        List<ManagerExpenseRow> rows = rowService.getRowsBySubmissionId(submissionId);
        return ResponseEntity.ok(rows);
    }

    /**
     * 🚦 Approve or reject a row.
     */
    @PatchMapping("/row/{rowId}/status")
    public ResponseEntity<String> updateRowStatus(
            @PathVariable Long rowId,
            @RequestParam RowStatus status) {
        if (status != RowStatus.APPROVED && status != RowStatus.REJECTED_FINANCE) {
            return ResponseEntity.badRequest().body("❌ Invalid status for Finance role.");
        }

        ManagerExpenseRow updated = rowService.updateRowStatus(rowId, status);
        rowService.updateSubmissionStatusIfComplete(updated.getSubmission().getId());

        return ResponseEntity.ok("✅ Row status updated.");
    }
}
