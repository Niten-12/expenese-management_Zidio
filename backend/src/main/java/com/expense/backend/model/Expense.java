//model//Expense.java
package com.expense.backend.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "expenses")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 12, nullable = false)
    private String employeeId;

    @Column(length = 100, nullable = false)
    private String name;

    @Column(length = 50, nullable = false)
    private String department;

    @Column(length = 50, nullable = false)
    private String category;

    @Column(nullable = false)
    private BigDecimal amount; // ✅ Updated from Long to BigDecimal

    @Column(nullable = false)
    private LocalDate dateSubmitted;

    @Column(length = 20, nullable = false)
    private String status;

    @Column(length = 50, nullable = false)
    private String assignedDepartment;

    @Column(length = 100, nullable = false)
    private String username;

    // ✅ Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDate getDateSubmitted() {
        return dateSubmitted;
    }

    public void setDateSubmitted(LocalDate dateSubmitted) {
        this.dateSubmitted = dateSubmitted;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAssignedDepartment() {
        return assignedDepartment;
    }

    public void setAssignedDepartment(String assignedDepartment) {
        this.assignedDepartment = assignedDepartment;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}

// package com.expense.backend.model;

// import java.time.LocalDate;

// import jakarta.persistence.Column;
// import jakarta.persistence.Entity;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
// import jakarta.persistence.Id;
// import jakarta.persistence.Table;

// @Entity
// @Table(name = "expenses")
// public class Expense {

// @Id
// @GeneratedValue(strategy = GenerationType.IDENTITY)
// private Long id;

// @Column(length = 100, nullable = false)
// private String username;

// @Column(length = 12, nullable = false)
// private String employeeId;

// @Column(length = 100, nullable = false)
// private String name;

// @Column(length = 50, nullable = false)
// private String department;

// @Column(length = 50, nullable = false)
// private String category;

// @Column(nullable = false)
// private Long amount;

// @Column(nullable = false)
// private LocalDate dateSubmitted;

// @Column(length = 20, nullable = false)
// private String status;

// @Column(length = 50, nullable = false)
// private String assignedDepartment;

// // Getters and Setters

// public Long getId() {
// return id;
// }

// public void setId(Long id) {
// this.id = id;
// }

// public String getUsername() {
// return username;
// }

// public void setUsername(String username) {
// this.username = username;
// }

// public String getEmployeeId() {
// return employeeId;
// }

// public void setEmployeeId(String employeeId) {
// this.employeeId = employeeId;
// }

// public String getName() {
// return name;
// }

// public void setName(String name) {
// this.name = name;
// }

// public String getDepartment() {
// return department;
// }

// public void setDepartment(String department) {
// this.department = department;
// }

// public String getCategory() {
// return category;
// }

// public void setCategory(String category) {
// this.category = category;
// }

// public Long getAmount() {
// return amount;
// }

// public void setAmount(Long amount) {
// this.amount = amount;
// }

// public LocalDate getDateSubmitted() {
// return dateSubmitted;
// }

// public void setDateSubmitted(LocalDate dateSubmitted) {
// this.dateSubmitted = dateSubmitted;
// }

// public String getStatus() {
// return status;
// }

// public void setStatus(String status) {
// this.status = status;
// }

// public String getAssignedDepartment() {
// return assignedDepartment;
// }

// public void setAssignedDepartment(String assignedDepartment) {
// this.assignedDepartment = assignedDepartment;
// }
// }
