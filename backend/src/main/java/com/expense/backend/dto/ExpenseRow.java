// // ExpenseRow.java
package com.expense.backend.dto;

import java.math.BigDecimal;

import com.expense.backend.model.RowStatus;

public class ExpenseRow {

    private String employeeId;
    private String employeeName;
    private String category;
    private BigDecimal cost;
    private String description;
    private Integer rowIndex;
    private RowStatus status; // Optional at submission time, used during finance/admin review

    // ✅ Getters and Setters — Cleaned

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getCost() {
        return cost;
    }

    public void setCost(BigDecimal cost) {
        this.cost = cost;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getRowIndex() {
        return rowIndex;
    }

    public void setRowIndex(Integer rowIndex) {
        this.rowIndex = rowIndex;
    }

    public RowStatus getStatus() {
        return status;
    }

    public void setStatus(RowStatus status) {
        this.status = status;
    }
}

// package com.expense.backend.dto;

// import java.math.BigDecimal;

// import com.expense.backend.model.RowStatus;

// public class ExpenseRow {

// private String employeeId;
// private String employeeName;
// private String category;
// private BigDecimal cost;
// private String description;
// private Integer rowIndex;
// private RowStatus status; // Optional at submission time, used during
// finance/admin review

// // Getters and Setters
// private double amount;

// public double getAmount() {
// return amount;
// }

// public void setAmount(double amount) {
// this.amount = amount;
// }

// public String getEmployeeId() {
// return employeeId;
// }

// public void setEmployeeId(String employeeId) {
// this.employeeId = employeeId;
// }

// public String getEmployeeName() {
// return employeeName;
// }

// public void setEmployeeName(String employeeName) {
// this.employeeName = employeeName;
// }

// public String getCategory() {
// return category;
// }

// public void setCategory(String category) {
// this.category = category;
// }

// public BigDecimal getCost() {
// return cost;
// }

// public void setCost(BigDecimal cost) {
// this.cost = cost;
// }

// public String getDescription() {
// return description;
// }

// public void setDescription(String description) {
// this.description = description;
// }

// public Integer getRowIndex() {
// return rowIndex;
// }

// public void setRowIndex(Integer rowIndex) {
// this.rowIndex = rowIndex;
// }

// public RowStatus getStatus() {
// return status;
// }

// public void setStatus(RowStatus status) {
// this.status = status;
// }
// }
