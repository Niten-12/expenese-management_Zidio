package com.expense.backend.controller;

import com.expense.backend.model.ManagerExpenseRow;
import com.expense.backend.model.ManagerExpenseSubmission;
import com.expense.backend.model.RowStatus;
import com.expense.backend.model.SubmissionStatus;
import com.expense.backend.service.ManagerExpenseRowService;
import com.expense.backend.service.ManagerExpenseSubmissionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminExpenseReviewController {

    @Autowired
    private ManagerExpenseSubmissionService submissionService;

    @Autowired
    private ManagerExpenseRowService rowService;

    /**
     * 🔄 Fetch all submissions currently in REVIEW_ADMIN state.
     */
    @GetMapping("/pending-submissions")
    public ResponseEntity<List<ManagerExpenseSubmission>> getPendingAdminSubmissions() {
        List<ManagerExpenseSubmission> list = submissionService.getSubmissionsByStatus(SubmissionStatus.REVIEW_ADMIN);
        return ResponseEntity.ok(list);
    }

    /**
     * 📄 Fetch all rows under a specific submission.
     */
    @GetMapping("/submission/{submissionId}/rows")
    public ResponseEntity<List<ManagerExpenseRow>> getSubmissionRows(@PathVariable Long submissionId) {
        List<ManagerExpenseRow> rows = rowService.getRowsBySubmissionId(submissionId);
        return ResponseEntity.ok(rows);
    }

    /**
     * 🚦 Admin approves or rejects a single row.
     */
    @PatchMapping("/row/{rowId}/status")
    public ResponseEntity<String> updateAdminRowStatus(
            @PathVariable Long rowId,
            @RequestParam RowStatus status) {
        if (status != RowStatus.APPROVED && status != RowStatus.REJECTED_ADMIN) {
            return ResponseEntity.badRequest().body("❌ Invalid status for Admin role.");
        }

        ManagerExpenseRow updated = rowService.updateRowStatus(rowId, status);
        rowService.updateSubmissionStatusIfComplete(updated.getSubmission().getId());

        return ResponseEntity.ok("✅ Admin row status updated.");
    }
}
