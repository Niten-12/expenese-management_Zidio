// AdminController.java
package com.expense.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @GetMapping("/dashboard")
    public ResponseEntity<String> dashboard() {
        return ResponseEntity.ok("✅ Admin dashboard accessed successfully!");
    }

    // Optional: could move user management to UserManagementController
}

// package com.expense.backend.controller;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import com.expense.backend.payload.CreateUserRequest;
// import com.expense.backend.service.UserService;

// @RestController
// @RequestMapping("/api/admin")
// public class AdminController {

// @Autowired
// private UserService userService;

// @GetMapping("/dashboard")
// public ResponseEntity<String> dashboard() {
// return ResponseEntity.ok("✅ Admin dashboard accessed successfully!");
// }

// @PostMapping("/create-user")
// @PreAuthorize("hasRole('ADMIN')")
// public ResponseEntity<String> createUser(@RequestBody CreateUserRequest
// request) {
// userService.createUser(request);
// return ResponseEntity.ok("✅ User created successfully!");
// }
// }
