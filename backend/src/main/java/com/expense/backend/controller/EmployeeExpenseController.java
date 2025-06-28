package com.expense.backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.expense.backend.dto.EmployeeExpenseRequest;
import com.expense.backend.model.Expense;
import com.expense.backend.service.ExpenseService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/employee/expenses")
public class EmployeeExpenseController {

    private final ExpenseService expenseService;

    public EmployeeExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    public String submitExpense(@Valid @RequestBody EmployeeExpenseRequest req, Authentication auth) {
        expenseService.saveEmployeeExpense(req, auth.getName());
        return "Expense submitted successfully.";
    }

    @GetMapping
    public Page<Expense> getMyExpenses(Authentication auth,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        return expenseService.getEmployeeExpenses(auth.getName(), category, status, pageable);
    }
}
