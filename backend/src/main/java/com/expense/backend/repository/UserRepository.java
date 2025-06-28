//UserRepository.java
package com.expense.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.expense.backend.model.Role;
import com.expense.backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by username
    Optional<User> findByUsername(String username);

    // OPTIONAL: Find users by role (can be useful for admin listing users by role)
    List<User> findByRole(Role role);

    // OPTIONAL: Find user by username + role (can add security layer or checks)
    Optional<User> findByUsernameAndRole(String username, Role role);
}
