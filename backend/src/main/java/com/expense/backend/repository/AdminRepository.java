//AdminRepositoy.java
package com.expense.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.expense.backend.model.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    boolean existsByUsername(String username);

    // ✅ Add this for AuthService
    Optional<Admin> findByUsername(String username);
}
