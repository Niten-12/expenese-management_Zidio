package com.expense.backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.expense.backend.model.Expense;
import com.expense.backend.service.ExpenseService;

@RestController
@RequestMapping("/api/finance/expenses")
public class FinanceExpenseController {

    private final ExpenseService expenseService;

    public FinanceExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping("/approved")
    public Page<Expense> getApprovedExpenses(Pageable pageable) {
        return expenseService.getFinanceExpensesForProcessing(pageable);
    }

    @PostMapping("/process/{id}")
    public String processExpense(@PathVariable Long id) {
        expenseService.processExpenseByFinance(id);
        return "Expense processed.";
    }
}
