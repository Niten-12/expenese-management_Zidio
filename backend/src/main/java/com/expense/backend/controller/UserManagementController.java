//UserManagementController.java
package com.expense.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.expense.backend.dto.UserDto;
import com.expense.backend.payload.CreateUserRequest;
import com.expense.backend.service.UserService;

@RestController
@RequestMapping("/api/admin/users")
public class UserManagementController {

    private final UserService userService;

    public UserManagementController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> createUser(@RequestBody CreateUserRequest request) {
        userService.createUser(request);
        Map<String, String> response = new HashMap<>();
        response.put("message", "✅ User created successfully.");
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // @PostMapping
    // public ResponseEntity<String> createUser(@RequestBody CreateUserRequest
    // request) {
    // userService.createUser(request);
    // return ResponseEntity.ok("✅ User created successfully.");
    // }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "✅ User deleted successfully.");
        return ResponseEntity.ok(response);
    }

}
