package com.expense.backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.expense.backend.model.Expense;
import com.expense.backend.service.ExpenseService;

@RestController
@RequestMapping("/api/manager/expenses")
public class ManagerExpenseController {

    private final ExpenseService expenseService;

    public ManagerExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping("/pending")
    public Page<Expense> getPendingExpenses(Pageable pageable) {
        return expenseService.getManagerExpensesForApproval(pageable);
    }

    @PostMapping("/approve/{id}")
    public ResponseEntity<String> approveExpense(@PathVariable Long id) {
        expenseService.approveExpenseByManager(id);
        return ResponseEntity.ok("Expense approved.");
    }

    @PostMapping("/reject/{id}")
    public ResponseEntity<String> rejectExpense(@PathVariable Long id) {
        expenseService.rejectExpenseByManager(id);
        return ResponseEntity.ok("Expense rejected.");
    }
}
