package com.expense.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.expense.backend.dto.ExpenseRequest;
import com.expense.backend.dto.ManagerExpenseRowDTO;
import com.expense.backend.dto.SubmissionHistoryDTO;
import com.expense.backend.model.ManagerExpenseSubmission;
import com.expense.backend.service.ManagerExpenseSubmissionService;

@RestController
@RequestMapping("/api/manager")
public class ManagerExpenseSubmissionController {

    @Autowired
    private ManagerExpenseSubmissionService submissionService;

    /**
     * Endpoint for managers to submit expense form with optional file.
     * Accepts multipart/form-data:
     * - JSON part mapped to `ExpenseRequest`
     * - Optional PDF or file as MultipartFile
     */
    @PostMapping(value = "/submit-expense", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> submitExpense(
            @RequestPart("form") ExpenseRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        ManagerExpenseSubmission saved = submissionService.saveExpenseSubmission(request, file);
        // return ResponseEntity.status(201).body("✅ Expense submitted with Submission
        // No: " + saved.getSubmissionNo());
        return ResponseEntity
                .status(201)
                .body(Map.of("message", "✅ Expense submitted with Submission No: " + saved.getSubmissionNo()));
    }

    @GetMapping("/history/{managerId}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<SubmissionHistoryDTO>> getSubmissionHistory(@PathVariable Long managerId) {
        List<SubmissionHistoryDTO> history = submissionService.getSubmissionHistoryByManagerId(managerId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/rows/{submissionNo}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<ManagerExpenseRowDTO>> getRowsBySubmissionNo(
            @PathVariable String submissionNo) {
        List<ManagerExpenseRowDTO> rows = submissionService.getExpenseRowsBySubmissionNo(submissionNo);
        return ResponseEntity.ok(rows);
    }

}

// package com.expense.backend.controller;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
// import org.springframework.web.bind.annotation.ModelAttribute;
// import org.springframework.web.bind.annotation.PostMapping;
// // import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestPart;
// import org.springframework.web.bind.annotation.RestController;
// import org.springframework.web.multipart.MultipartFile;

// import com.expense.backend.dto.ExpenseRequest;
// import com.expense.backend.model.ManagerExpenseSubmission;
// import com.expense.backend.service.ManagerExpenseSubmissionService;

// @RestController
// @RequestMapping("/api/manager")
// public class ManagerExpenseSubmissionController {

// @Autowired
// private ManagerExpenseSubmissionService submissionService;

// @PostMapping("/submit-expense")
// @PreAuthorize("hasRole('MANAGER')")
// public ResponseEntity<?> submitExpense(
// @ModelAttribute ExpenseRequest request,
// @RequestPart(value = "file", required = false) MultipartFile file // if a
// file is attached
// ) {
// ManagerExpenseSubmission saved =
// submissionService.saveExpenseSubmission(request, file);
// // public ResponseEntity<?> submitExpense(@RequestBody ExpenseRequest
// request) {
// // ManagerExpenseSubmission saved =
// submissionService.saveExpenseSubmission(request);
// return ResponseEntity.status(201).body("✅ Expense submitted with Submission
// No: " + saved.getSubmissionNo());
// }
// }
