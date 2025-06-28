// ExpenseSpecifications.java
package com.expense.backend.spec;

import org.springframework.data.jpa.domain.Specification;

import com.expense.backend.model.Expense;

public class ExpenseSpecifications {

    public static Specification<Expense> hasUsername(String username) {
        return (root, query, cb) -> {
            if (username == null)
                return cb.conjunction();
            return cb.equal(root.get("username"), username);
        };
    }

    public static Specification<Expense> hasCategory(String category) {
        return (root, query, cb) -> {
            if (category == null)
                return cb.conjunction();
            return cb.equal(root.get("category"), category);
        };
    }

    public static Specification<Expense> hasStatus(String status) {
        return (root, query, cb) -> {
            if (status == null)
                return cb.conjunction();
            return cb.equal(root.get("status"), status);
        };
    }

    public static Specification<Expense> assignedTo(String dept) {
        return (root, query, cb) -> {
            if (dept == null)
                return cb.conjunction();
            return cb.equal(root.get("assignedDepartment"), dept);
        };
    }
}

// package com.expense.backend.spec;

// import org.springframework.data.jpa.domain.Specification;

// import com.expense.backend.model.Expense;

// public class ExpenseSpecifications {

// public static Specification<Expense> hasUsername(String username) {
// return (root, query, cb) -> cb.equal(root.get("username"), username);
// }

// public static Specification<Expense> hasCategory(String category) {
// return (root, query, cb) -> cb.equal(root.get("category"), category);
// }

// public static Specification<Expense> hasStatus(String status) {
// return (root, query, cb) -> cb.equal(root.get("status"), status);
// }
// }
