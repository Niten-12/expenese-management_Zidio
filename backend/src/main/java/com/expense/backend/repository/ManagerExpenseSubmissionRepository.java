//ManagerExpenseSubmissionRepository
package com.expense.backend.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.expense.backend.model.ManagerExpenseSubmission;
import com.expense.backend.model.SubmissionStatus;

public interface ManagerExpenseSubmissionRepository extends JpaRepository<ManagerExpenseSubmission, Long> {

    // 🔢 Used for generating unique submission numbers
    // @Query("SELECT COUNT(s) FROM ManagerExpenseSubmission s WHERE s.date =
    // :date")
    // long countByDate(@Param("date") LocalDate date);
    @Query("SELECT COUNT(s) FROM ManagerExpenseSubmission s WHERE FUNCTION('DATE', s.date) = :date")
    long countByDate(@Param("date") LocalDate date);

    // 📋 Used by Manager to fetch all their own submissions
    List<ManagerExpenseSubmission> findByManagerId(Long managerId);

    // 📤 Used by Finance to fetch submissions under review
    List<ManagerExpenseSubmission> findByStatus(SubmissionStatus status);

    // 🔍 Optional: Find by Submission No (for drill-down view)
    ManagerExpenseSubmission findBySubmissionNo(String submissionNo);
}
