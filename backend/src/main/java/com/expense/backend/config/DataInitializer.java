//DataInitializer.java
package com.expense.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.expense.backend.model.Admin;
import com.expense.backend.repository.AdminRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!adminRepository.existsByUsername("admin")) {
            Admin admin = new Admin();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@example.com");
            adminRepository.save(admin);
            System.out.println("✅ Default admin user created with encoded password.");
        } else {
            Admin existingAdmin = adminRepository.findByUsername("admin").orElse(null);
            if (existingAdmin != null && !existingAdmin.getPassword().startsWith("$2a$")) {
                existingAdmin.setPassword(passwordEncoder.encode(existingAdmin.getPassword()));
                adminRepository.save(existingAdmin);
                System.out.println("✅ Existing admin password was plain text — encoded successfully.");
            } else {
                System.out.println("ℹ️ Admin already exists with encoded password. No action needed.");
            }
        }
    }
}
