package com.expense.backend.dto;

import java.util.List;

public class EmployeeExpenseRequest {

    private String employeeId;
    private String name;
    private String department;
    private List<EmployeeExpenseRow> expenses;

    // Getters and Setters
    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public List<EmployeeExpenseRow> getExpenses() {
        return expenses;
    }

    public void setExpenses(List<EmployeeExpenseRow> expenses) {
        this.expenses = expenses;
    }
}
