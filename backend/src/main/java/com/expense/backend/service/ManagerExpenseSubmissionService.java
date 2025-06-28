//ManagerExpenseSubmissionService
package com.expense.backend.service;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.expense.backend.dto.ExpenseRequest;
import com.expense.backend.dto.ManagerExpenseRowDTO;
import com.expense.backend.dto.SubmissionHistoryDTO;
import com.expense.backend.model.ManagerExpenseRow;
import com.expense.backend.model.ManagerExpenseSubmission;
import com.expense.backend.model.RowStatus;
import com.expense.backend.model.SubmissionStatus;
import com.expense.backend.repository.ManagerExpenseRowRepository;
import com.expense.backend.repository.ManagerExpenseSubmissionRepository;
import com.expense.backend.util.SubmissionNumberGenerator;

import jakarta.transaction.Transactional;

@Service
public class ManagerExpenseSubmissionService {

    @Autowired
    private ManagerExpenseSubmissionRepository submissionRepository;

    @Autowired
    private ManagerExpenseRowRepository rowRepository;

    /**
     * Generate a unique Submission Number in format: SUBM-YYYYMMDD-001
     */
    public String generateUniqueSubmissionNumber() {
        String submissionNo;
        int sequence = 1;

        do {
            submissionNo = SubmissionNumberGenerator.generate(sequence);
            sequence++;
        } while (submissionRepository.findBySubmissionNo(submissionNo) != null);

        return submissionNo;
    }

    /**
     * Save full manager expense submission with optional uploaded file.
     * 
     * @param req  JSON body representing form data
     * @param file Optional uploaded file (PDF, image, etc.)
     * @return saved ManagerExpenseSubmission
     */
    @Transactional
    public ManagerExpenseSubmission saveExpenseSubmission(ExpenseRequest req, MultipartFile file) {
        // Optional logging or file processing
        if (file != null && !file.isEmpty()) {
            System.out.println("📎 Uploaded file: " + file.getOriginalFilename());
            // Optional: Save to filesystem or DB
        }

        // Delegate core logic to main method
        return saveExpenseSubmission(req);
    }

    /**
     * Core saving logic for Expense submission.
     * Handles header + dynamic row insertions transactionally.
     */
    @Transactional
    public ManagerExpenseSubmission saveExpenseSubmission(ExpenseRequest req) {

        // Step 1: Prepare header entity
        ManagerExpenseSubmission submission = new ManagerExpenseSubmission();
        submission.setManagerId(req.getManagerId());
        submission.setManagerName(req.getManagerName());
        submission.setDepartment(req.getDepartment());
        submission.setDate(req.getDate());
        submission.setPurpose(req.getPurpose());
        submission.setTotalEmployees(req.getTotalEmployees());
        submission.setTotalCost(req.getTotalCost());
        submission.setFileName(req.getFileName());
        submission.setSubmissionNo(generateUniqueSubmissionNumber());

        // Step 2: Persist the header
        ManagerExpenseSubmission savedSubmission = submissionRepository.saveAndFlush(submission);

        // Step 3: Bind all dynamic rows to the saved header
        List<ManagerExpenseRow> expenseRows = req.getExpenseRows().stream()
                .map(rowDto -> {
                    ManagerExpenseRow row = new ManagerExpenseRow();
                    row.setEmployeeId(rowDto.getEmployeeId());
                    row.setEmployeeName(rowDto.getEmployeeName());
                    row.setCategory(rowDto.getCategory());
                    row.setCost(rowDto.getCost());
                    row.setDescription(rowDto.getDescription());
                    row.setRowIndex(rowDto.getRowIndex());
                    row.setStatus(rowDto.getStatus() != null ? rowDto.getStatus() : RowStatus.REVIEW_FINANCE);
                    row.setSubmission(savedSubmission); // ✅ Maintain FK reference
                    return row;
                })
                .collect(Collectors.toList());

        // Step 4: Persist child rows
        rowRepository.saveAll(expenseRows);

        // Step 5: Return the combined object
        savedSubmission.setExpenseRows(expenseRows);
        return savedSubmission;
    }

    public List<SubmissionHistoryDTO> getSubmissionHistoryByManagerId(Long managerId) {
        List<ManagerExpenseSubmission> submissions = submissionRepository.findByManagerId(managerId);
        return submissions.stream().map(sub -> {
            SubmissionHistoryDTO dto = new SubmissionHistoryDTO();
            dto.setSubmissionNo(sub.getSubmissionNo());
            dto.setDate(sub.getDate());
            dto.setPurpose(sub.getPurpose());
            dto.setDepartment(sub.getDepartment());
            dto.setTotalCost(sub.getTotalCost());
            dto.setTotalEmployees(sub.getTotalEmployees());
            dto.setFileName(sub.getFileName());
            dto.setStatus(sub.getStatus().name()); // if enum
            return dto;
        }).collect(Collectors.toList());
    }

    public List<ManagerExpenseRowDTO> getExpenseRowsBySubmissionNo(String submissionNo) {
        List<ManagerExpenseRow> rows = rowRepository.findBySubmissionSubmissionNo(submissionNo);
        AtomicInteger counter = new AtomicInteger(1);

        return rows.stream().map(row -> {
            ManagerExpenseRowDTO dto = new ManagerExpenseRowDTO();
            dto.setSerialNo(counter.getAndIncrement());
            dto.setEmployeeId(row.getEmployeeId());
            dto.setName(row.getEmployeeName()); // ✅ FIXED: Correct field
            dto.setCategory(row.getCategory());
            dto.setCost(row.getCost()); // ✅ FIXED: Use BigDecimal in DTO or convert
            dto.setStatus(row.getStatus().toString());
            dto.setDescription(row.getDescription()); // ✅ Optional
            return dto;
        }).collect(Collectors.toList());

    }

    /**
     * Get all submissions made by a manager (for history view).
     */
    public List<ManagerExpenseSubmission> getSubmissionsByManager(Long managerId) {
        return submissionRepository.findByManagerId(managerId);
    }

    /**
     * Get full details of a submission by submission number.
     */
    public ManagerExpenseSubmission getBySubmissionNo(String submissionNo) {
        return submissionRepository.findBySubmissionNo(submissionNo);
    }

    /**
     * Get submissions by status (optional filtering).
     */
    public List<ManagerExpenseSubmission> getSubmissionsByStatus(SubmissionStatus submissionStatus) {
        return submissionRepository.findByStatus(submissionStatus);
    }

    // 🔧 Accessors for unit testing / DI

    public ManagerExpenseRowRepository getRowRepository() {
        return rowRepository;
    }

    public void setRowRepository(ManagerExpenseRowRepository rowRepository) {
        this.rowRepository = rowRepository;
    }
}

// package com.expense.backend.service;

// import java.util.List;
// import java.util.stream.Collectors;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import com.expense.backend.dto.ExpenseRequest;
// import com.expense.backend.model.ManagerExpenseRow;
// import com.expense.backend.model.ManagerExpenseSubmission;
// import com.expense.backend.model.RowStatus;
// import com.expense.backend.model.SubmissionStatus;
// import com.expense.backend.repository.ManagerExpenseRowRepository;
// import com.expense.backend.repository.ManagerExpenseSubmissionRepository;
// import com.expense.backend.util.SubmissionNumberGenerator;

// import jakarta.transaction.Transactional;

// @Service
// public class ManagerExpenseSubmissionService {

// @Autowired
// private ManagerExpenseSubmissionRepository submissionRepository;

// @Autowired
// private ManagerExpenseRowRepository rowRepository;

// // public String generateSubmissionNumber() {
// // long countToday = submissionRepository.countByDate(LocalDate.now());
// // return SubmissionNumberGenerator.generate((int) countToday + 1);
// // }
// public String generateUniqueSubmissionNumber() {
// String submissionNo;
// int sequence = 1;

// do {
// submissionNo = SubmissionNumberGenerator.generate(sequence);
// sequence++;
// } while (submissionRepository.findBySubmissionNo(submissionNo) != null);

// return submissionNo;
// }

// /**
// * Saves a full expense submission along with its dynamic line items.
// * Fixed to explicitly persist header and rows in sequence to avoid FK
// * constraint failure.
// */
// @Transactional
// public ManagerExpenseSubmission saveExpenseSubmission(ExpenseRequest req) {

// // Step 1: Create header (submission) entity
// ManagerExpenseSubmission submission = new ManagerExpenseSubmission();
// submission.setManagerId(req.getManagerId());
// submission.setManagerName(req.getManagerName());
// submission.setDepartment(req.getDepartment());
// submission.setDate(req.getDate());
// submission.setPurpose(req.getPurpose());
// submission.setTotalEmployees(req.getTotalEmployees());
// submission.setTotalCost(req.getTotalCost());
// submission.setFileName(req.getFileName());
// // submission.setSubmissionNo(generateSubmissionNumber());
// submission.setSubmissionNo(generateUniqueSubmissionNumber());

// // Step 2: Save header first so it gets a DB ID
// ManagerExpenseSubmission savedSubmission =
// submissionRepository.saveAndFlush(submission);

// // Step 3: Map and bind each row to the now-persisted submission
// List<ManagerExpenseRow> expenseRows = req.getExpenseRows()
// .stream()
// .map(rowDto -> {
// ManagerExpenseRow row = new ManagerExpenseRow();
// row.setEmployeeId(rowDto.getEmployeeId());
// row.setEmployeeName(rowDto.getEmployeeName());
// row.setCategory(rowDto.getCategory());
// row.setCost(rowDto.getCost());
// row.setDescription(rowDto.getDescription());
// row.setRowIndex(rowDto.getRowIndex());
// row.setStatus(rowDto.getStatus() != null ? rowDto.getStatus() :
// RowStatus.REVIEW_FINANCE);
// row.setSubmission(savedSubmission); // ✅ Now the FK points to a valid ID
// return row;
// })
// .collect(Collectors.toList());

// // Step 4: Save child rows manually (not relying on cascade)
// rowRepository.saveAll(expenseRows);

// // Step 5: Return the full object (attach rows for frontend if needed)
// savedSubmission.setExpenseRows(expenseRows);
// return savedSubmission;
// }

// /**
// * Fetch all submissions by a manager.
// */
// public List<ManagerExpenseSubmission> getSubmissionsByManager(Long managerId)
// {
// return submissionRepository.findByManagerId(managerId);
// }

// /**
// * Retrieve a single submission by its unique submission number.
// */
// public ManagerExpenseSubmission getBySubmissionNo(String submissionNo) {
// return submissionRepository.findBySubmissionNo(submissionNo);
// }

// // Accessors for dependency injection/testing

// public ManagerExpenseRowRepository getRowRepository() {
// return rowRepository;
// }

// public void setRowRepository(ManagerExpenseRowRepository rowRepository) {
// this.rowRepository = rowRepository;
// }

// /**
// * Placeholder for status-based filtering, if needed later.
// */
// public List<ManagerExpenseSubmission> getSubmissionsByStatus(SubmissionStatus
// submissionStatus) {
// // throw new UnsupportedOperationException("Not supported yet.");
// return submissionRepository.findByStatus(submissionStatus);
// }
// }
