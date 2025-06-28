package com.expense.backend.service;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.expense.backend.dto.EmployeeExpenseRequest;
import com.expense.backend.dto.EmployeeExpenseRow;
import com.expense.backend.model.Expense;
import com.expense.backend.repository.ExpenseRepository;
import com.expense.backend.spec.ExpenseSpecifications;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    // ✅ EMPLOYEE: Submit own expense rows
    public void saveEmployeeExpense(EmployeeExpenseRequest req, String username) {
        for (EmployeeExpenseRow row : req.getExpenses()) {
            Expense exp = new Expense();
            exp.setEmployeeId(req.getEmployeeId());
            exp.setName(req.getName());
            exp.setDepartment(req.getDepartment());
            exp.setCategory(row.getCategory());
            exp.setAmount(BigDecimal.valueOf(row.getAmount())); // ✅ Match entity's BigDecimal type
            exp.setDateSubmitted(LocalDate.now());
            exp.setStatus("Pending");
            exp.setAssignedDepartment("Manager");
            exp.setUsername(username);
            expenseRepository.save(exp);
        }
    }

    // 📄 EMPLOYEE: View submitted expenses
    public Page<Expense> getEmployeeExpenses(String username, String category, String status, Pageable pageable) {
        return expenseRepository.findAll(
                ExpenseSpecifications.hasUsername(username)
                        .and(ExpenseSpecifications.hasCategory(category))
                        .and(ExpenseSpecifications.hasStatus(status)),
                pageable);
    }

    // ✅ MANAGER: View expenses awaiting approval
    public Page<Expense> getManagerExpensesForApproval(Pageable pageable) {
        return expenseRepository.findAll(
                ExpenseSpecifications.assignedTo("Manager")
                        .and(ExpenseSpecifications.hasStatus("Pending")),
                pageable);
    }

    // 🟢 MANAGER: Approve expense
    public void approveExpenseByManager(Long id) {
        Expense exp = expenseRepository.findById(id).orElseThrow();
        exp.setStatus("Approved");
        exp.setAssignedDepartment("Finance");
        expenseRepository.save(exp);
    }

    // 🔴 MANAGER: Reject expense
    public void rejectExpenseByManager(Long id) {
        Expense exp = expenseRepository.findById(id).orElseThrow();
        exp.setStatus("Rejected");
        expenseRepository.save(exp);
    }

    // ✅ FINANCE: View expenses approved by manager
    public Page<Expense> getFinanceExpensesForProcessing(Pageable pageable) {
        return expenseRepository.findAll(
                ExpenseSpecifications.assignedTo("Finance")
                        .and(ExpenseSpecifications.hasStatus("Approved")),
                pageable);
    }

    // ✅ FINANCE: Final processing
    public void processExpenseByFinance(Long id) {
        Expense exp = expenseRepository.findById(id).orElseThrow();
        exp.setStatus("Processed");
        expenseRepository.save(exp);
    }
}

// package com.expense.backend.service;

// import java.time.LocalDate;

// import org.springframework.data.domain.Page;
// import org.springframework.data.domain.Pageable;
// import org.springframework.stereotype.Service;

// import com.expense.backend.dto.ExpenseRequest;
// import com.expense.backend.dto.ExpenseRow;
// import com.expense.backend.model.Expense;
// import com.expense.backend.repository.ExpenseRepository;
// import com.expense.backend.spec.ExpenseSpecifications;

// @Service
// public class ExpenseService {

// private final ExpenseRepository expenseRepository;

// public ExpenseService(ExpenseRepository expenseRepository) {
// this.expenseRepository = expenseRepository;
// }

// public void saveExpenses(ExpenseRequest req, String username) {
// for (ExpenseRow row : req.getExpenses()) {
// Expense exp = new Expense();
// exp.setEmployeeId(req.getEmployeeId());
// exp.setName(req.getName());
// exp.setDepartment(req.getDepartment());
// exp.setCategory(row.getCategory());
// exp.setAmount(row.getAmount());
// exp.setDateSubmitted(LocalDate.now());
// exp.setStatus("Pending");
// exp.setAssignedDepartment("Manager");
// exp.setUsername(username);
// expenseRepository.save(exp);
// }
// }

// public Page<Expense> getExpensesByUsernameAndFilters(String username, String
// category, String status,
// Pageable pageable) {
// return expenseRepository.findAll(
// ExpenseSpecifications.hasUsername(username)
// .and(ExpenseSpecifications.hasCategory(category))
// .and(ExpenseSpecifications.hasStatus(status)),
// pageable);
// }
// }

// package com.expense.backend.service;

// import com.expense.backend.dto.ExpenseRow;
// import com.expense.backend.model.Expense;
// import com.expense.backend.repository.ExpenseRepository;

// import org.springframework.data.domain.Page;
// import org.springframework.data.domain.Pageable;
// import org.springframework.stereotype.Service;

// import java.time.LocalDate;
// import java.util.List;

// @Service
// public class ExpenseService {

// private final ExpenseRepository expenseRepository;

// public ExpenseService(ExpenseRepository expenseRepository) {
// this.expenseRepository = expenseRepository;
// }

// public void saveExpenses(String employeeId, String name, String department,
// List<ExpenseRow> rows) {
// for (ExpenseRow row : rows) {
// Expense exp = new Expense();
// exp.setEmployeeId(employeeId);
// exp.setName(name);
// exp.setDepartment(department);
// exp.setCategory(row.getCategory());
// exp.setAmount(row.getAmount());
// exp.setDateSubmitted(LocalDate.now());
// exp.setStatus("Pending");
// exp.setAssignedDepartment("Manager");
// expenseRepository.save(exp);
// }
// }

// public Page<Expense> getExpensesByUsernameAndFilters(String username, String
// category, String status,
// Pageable pageable) {
// return expenseRepository.findByUsernameAndOptionalFilters(username, category,
// status, pageable);
// }
// }

// package com.expense.backend.service;

// import com.expense.backend.model.Expense;
// import com.expense.backend.dto.ExpenseRow;
// import com.expense.backend.repository.ExpenseRepository;

// import org.springframework.data.domain.Page;
// import org.springframework.data.domain.Pageable;
// import org.springframework.stereotype.Service;

// import java.time.LocalDate;
// import java.util.List;

// @Service
// public class ExpenseService {

// private final ExpenseRepository expenseRepository;

// public ExpenseService(ExpenseRepository expenseRepository) {
// this.expenseRepository = expenseRepository;
// }

// public void saveExpenses(String employeeId, String name, String department,
// List<ExpenseRow> rows) {
// for (ExpenseRow row : rows) {
// Expense exp = new Expense();
// exp.setEmployeeId(employeeId);
// exp.setName(name);
// exp.setDepartment(department);
// exp.setCategory(row.getCategory());
// exp.setAmount(row.getAmount());
// exp.setDateSubmitted(LocalDate.now());
// exp.setStatus("Pending");
// exp.setAssignedDepartment("Manager");
// expenseRepository.save(exp);
// }
// }

// public Page<Expense> getExpensesByUsernameAndFilters(String username, String
// category, String status,
// Pageable pageable) {
// // Assuming custom query or Specification — pseudocode here:
// return expenseRepository.findByFilters(username, category, status, pageable);
// }
// }
