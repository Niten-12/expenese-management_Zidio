package com.expense.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.expense.backend.model.SubmissionStatus;

public class SubmissionResponseDTO {

    private String submissionNo;
    private Long managerId;
    private String managerName;
    private String department;
    private LocalDate date;
    private String purpose;
    private Integer totalEmployees;
    private BigDecimal totalCost;
    private SubmissionStatus status;
    private String fileName;
    private List<ExpenseRow> expenseRows;

    // Getters and Setters

    public String getSubmissionNo() {
        return submissionNo;
    }

    public void setSubmissionNo(String submissionNo) {
        this.submissionNo = submissionNo;
    }

    public Long getManagerId() {
        return managerId;
    }

    public void setManagerId(Long managerId) {
        this.managerId = managerId;
    }

    public String getManagerName() {
        return managerName;
    }

    public void setManagerName(String managerName) {
        this.managerName = managerName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public Integer getTotalEmployees() {
        return totalEmployees;
    }

    public void setTotalEmployees(Integer totalEmployees) {
        this.totalEmployees = totalEmployees;
    }

    public BigDecimal getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(BigDecimal totalCost) {
        this.totalCost = totalCost;
    }

    public SubmissionStatus getStatus() {
        return status;
    }

    public void setStatus(SubmissionStatus status) {
        this.status = status;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public List<ExpenseRow> getExpenseRows() {
        return expenseRows;
    }

    public void setExpenseRows(List<ExpenseRow> expenseRows) {
        this.expenseRows = expenseRows;
    }
}
