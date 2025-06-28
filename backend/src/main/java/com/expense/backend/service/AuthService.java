//AuthService.java
package com.expense.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.expense.backend.model.Admin;
import com.expense.backend.model.User;
import com.expense.backend.payload.AuthResponse;
import com.expense.backend.repository.AdminRepository;
import com.expense.backend.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthResponse login(String username, String password) {
        // Try user
        User user = userRepository.findByUsername(username).orElse(null);
        if (user != null) {
            if (!passwordEncoder.matches(password, user.getPassword())) {
                throw new BadCredentialsException("Invalid username or password");
            }
            String roleWithPrefix = "ROLE_" + user.getRole();
            String token = jwtService.generateToken(user.getUsername(), List.of(roleWithPrefix));

            // 💡 Return ID and username as part of response
            return new AuthResponse("Login successful", token, roleWithPrefix, user.getId(), user.getUsername());
        }

        // Try admin
        Admin admin = adminRepository.findByUsername(username).orElse(null);
        if (admin != null) {
            if (!passwordEncoder.matches(password, admin.getPassword())) {
                throw new BadCredentialsException("Invalid username or password");
            }
            String token = jwtService.generateToken(admin.getUsername(), List.of("ROLE_ADMIN"));

            // 💡 Return ID (if Admin has ID) and username
            return new AuthResponse("Login successful", token, "ROLE_ADMIN", admin.getId(), admin.getUsername());
        }

        throw new BadCredentialsException("Invalid username or password");
    }
}

// package com.expense.backend.service;

// import java.util.List;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.authentication.BadCredentialsException;
// import org.springframework.stereotype.Service;

// import com.expense.backend.model.Admin;
// import com.expense.backend.model.User;
// import com.expense.backend.payload.AuthResponse;
// import com.expense.backend.repository.AdminRepository;
// import com.expense.backend.repository.UserRepository;

// @Service
// public class AuthService {

// @Autowired
// private UserRepository userRepository;

// @Autowired
// private AdminRepository adminRepository;

// @Autowired
// private JwtService jwtService;

// public AuthResponse login(String username, String password) {
// // Try user
// User user = userRepository.findByUsername(username).orElse(null);
// if (user != null) {
// if (!password.equals(user.getPassword())) {
// throw new BadCredentialsException("Invalid username or password");
// }
// String roleWithPrefix = "ROLE_" + user.getRole();
// String token = jwtService.generateToken(user.getUsername(),
// List.of(roleWithPrefix));
// return new AuthResponse("Login successful", token, roleWithPrefix);
// }

// // Try admin
// Admin admin = adminRepository.findByUsername(username).orElse(null);
// if (admin != null) {
// if (!password.equals(admin.getPassword())) {
// throw new BadCredentialsException("Invalid username or password");
// }
// String token = jwtService.generateToken(admin.getUsername(),
// List.of("ROLE_ADMIN"));
// return new AuthResponse("Login successful", token, "ROLE_ADMIN");
// }

// throw new BadCredentialsException("Invalid username or password");
// }
// }

// package com.expense.backend.service;

// import java.util.List;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.authentication.BadCredentialsException;
// import org.springframework.stereotype.Service;

// import com.expense.backend.model.Admin;
// import com.expense.backend.model.User;
// import com.expense.backend.payload.AuthResponse;
// import com.expense.backend.payload.CreateUserRequest;
// import com.expense.backend.repository.AdminRepository;
// import com.expense.backend.repository.UserRepository;

// @Service
// public class AuthService {

// @Autowired
// private UserRepository userRepository;

// @Autowired
// private AdminRepository adminRepository;

// @Autowired
// private JwtService jwtService;

// public AuthResponse login(String username, String password) {
// // Try user
// User user = userRepository.findByUsername(username).orElse(null);
// if (user != null) {
// if (!password.equals(user.getPassword())) {
// throw new BadCredentialsException("Invalid username or password");
// }
// String roleWithPrefix = "ROLE_" + user.getRole();
// String token = jwtService.generateToken(
// user.getUsername(),
// List.of(roleWithPrefix));
// return new AuthResponse("Login successful", token, roleWithPrefix);
// }

// // Try admin
// Admin admin = adminRepository.findByUsername(username).orElse(null);
// if (admin != null) {
// if (!password.equals(admin.getPassword())) {
// throw new BadCredentialsException("Invalid username or password");
// }
// String token = jwtService.generateToken(
// admin.getUsername(),
// List.of("ROLE_ADMIN"));
// return new AuthResponse("Login successful", token, "ROLE_ADMIN");
// }

// throw new BadCredentialsException("Invalid username or password");
// }

// // ✅ Create User
// public void createUser(CreateUserRequest request) {
// if (userRepository.findByUsername(request.getUsername()).isPresent()) {
// throw new IllegalArgumentException("Username already exists");
// }

// User user = new User();
// user.setUsername(request.getUsername());
// user.setPassword(request.getPassword()); // Plain for now, hashing
// recommended
// user.setRole(request.getRole());

// userRepository.save(user);
// }

// // ✅ Delete User
// public void deleteUser(Long id) {
// if (!userRepository.existsById(id)) {
// throw new IllegalArgumentException("User not found");
// }
// userRepository.deleteById(id);
// }
// }
