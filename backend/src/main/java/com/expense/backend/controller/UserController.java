// UserController.java
package com.expense.backend.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "message", "Unauthorized access"));
        }

        // Extract username
        String username = authentication.getName();

        // Return as JSON
        return ResponseEntity.ok(Map.of(
                "username", username));
    }

    // Alternative way (optional): use @AuthenticationPrincipal
    @GetMapping("/me-alt")
    public ResponseEntity<?> getCurrentUserAlt(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "message", "Unauthorized access"));
        }

        return ResponseEntity.ok(Map.of(
                "username", userDetails.getUsername()));
    }
}
