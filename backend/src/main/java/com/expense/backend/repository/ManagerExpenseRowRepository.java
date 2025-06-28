//ManagerExpenseRowRepository
package com.expense.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.expense.backend.model.ManagerExpenseRow;
import com.expense.backend.model.RowStatus;

public interface ManagerExpenseRowRepository extends JpaRepository<ManagerExpenseRow, Long> {

    // 🔄 Fetch all rows by submission ID (used in table rendering)
    List<ManagerExpenseRow> findBySubmissionId(Long submissionId);

    // 🔍 Optional: Filter rows of a submission by their current status
    List<ManagerExpenseRow> findBySubmissionIdAndStatus(Long submissionId, RowStatus status);

    // 🎯 Bulk update logic typically done in service, not repository
    // But individual row updates are supported via save()

    // ✅ Optional: Fetch rows assigned for finance/admin review by status
    List<ManagerExpenseRow> findByStatus(RowStatus status);

    List<ManagerExpenseRow> findBySubmissionSubmissionNo(String submissionNo);
}
