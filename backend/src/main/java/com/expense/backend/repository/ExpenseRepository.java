// ExpenseRepository.java
package com.expense.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.expense.backend.model.Expense;

public interface ExpenseRepository extends JpaRepository<Expense, Long>, JpaSpecificationExecutor<Expense> {
}

// package com.expense.backend.repository;

// import com.expense.backend.model.Expense;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

// public interface ExpenseRepository extends JpaRepository<Expense, Long>,
// JpaSpecificationExecutor<Expense> {
// // No changes needed unless you want to add specific methods like:
// // Page<Expense> findByAssignedDepartmentAndStatus(...);
// }

// package com.expense.backend.repository;

// import org.springframework.data.domain.Page;
// import org.springframework.data.domain.Pageable;
// import org.springframework.data.jpa.repository.JpaRepository;

// import com.expense.backend.model.Expense;

// public interface ExpenseRepository extends JpaRepository<Expense, Long> {

// // This is a placeholder for your custom query, you will need to define it
// // properly (e.g. @Query + dynamic filters or Spring Data Specifications)
// Page<Expense> findByUsernameAndOptionalFilters(String username, String
// category, String status, Pageable pageable);
// }

// package com.expense.backend.repository;

// import org.springframework.data.domain.Page;
// import org.springframework.data.domain.Pageable;
// import org.springframework.data.jpa.repository.JpaRepository;

// import com.expense.backend.model.Expense;

// public interface ExpenseRepository extends JpaRepository<Expense, Long> {
// // Example dynamic query (you can build a spec or custom @Query as needed)
// Page<Expense> findByEmployeeIdAndCategoryAndStatus(
// String employeeId, String category, String status, Pageable pageable);
// }
