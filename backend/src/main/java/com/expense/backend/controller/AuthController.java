// //AuthController.java
package com.expense.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.expense.backend.payload.AuthRequest;
import com.expense.backend.payload.AuthResponse;
import com.expense.backend.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest authRequest) {
        AuthResponse response = authService.login(authRequest.getUsername(), authRequest.getPassword());
        return ResponseEntity.ok(response);
    }
}

// package com.expense.backend.controller;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.DeleteMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import com.expense.backend.payload.AuthRequest;
// import com.expense.backend.payload.AuthResponse;
// import com.expense.backend.payload.CreateUserRequest;
// import com.expense.backend.service.AuthService;

// import jakarta.validation.Valid;

// @RestController
// @RequestMapping("/api/auth")
// public class AuthController {

// @Autowired
// private AuthService authService;

// @PostMapping("/login")
// public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest
// authRequest) {
// System.out.println("LOGIN HIT: " + authRequest.getUsername());
// AuthResponse response = authService.login(authRequest.getUsername(),
// authRequest.getPassword());
// return ResponseEntity.ok(response);
// }

// @PostMapping("/admin/create-user")
// public ResponseEntity<String> createUser(@Valid @RequestBody
// CreateUserRequest createUserRequest) {
// authService.createUser(createUserRequest);
// return ResponseEntity.ok("User created successfully");
// }

// @DeleteMapping("/admin/delete-user/{id}")
// public ResponseEntity<String> deleteUser(@PathVariable Long id) {
// authService.deleteUser(id);
// return ResponseEntity.ok("User deleted successfully");
// }
// }
