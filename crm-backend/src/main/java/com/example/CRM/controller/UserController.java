package com.example.CRM.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.CRM.model.Users;
import com.example.CRM.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/employees")
public class UserController {

    @Autowired
    private UserService obj;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/newEmployee")
    public ResponseEntity<String> addEmployee(@Valid @RequestBody Users u, BindingResult result) {
        // 🔍 Check if there are validation errors
        if (result.hasErrors()) {
            // 💡 Return all validation errors
            return ResponseEntity.badRequest().body(result.getAllErrors().toString());
        }

        // ✅ Save the user if validation passes
        obj.saveUser(u);
        return ResponseEntity.status(HttpStatus.CREATED)
                            .body("The employee was added successfully: " + u.getName());
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody Map<String, String> passwordData) {
        String oldPassword = passwordData.get("oldPassword");
        String newPassword = passwordData.get("newPassword");

        if (oldPassword == null || newPassword == null || oldPassword.isEmpty() || newPassword.isEmpty()) {
            return ResponseEntity.badRequest().body("Old and new passwords are required");
        }

        try {
            Users user = obj.getCurrentUser();
            if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect old password");
            }

            if (passwordEncoder.matches(newPassword, user.getPassword())) {
                return ResponseEntity.badRequest().body("New password cannot be the same as the old password");
            }

            // Password validation
            if (newPassword.length() < 8) {
                return ResponseEntity.badRequest().body("Password must be at least 8 characters long");
            }
            if (!newPassword.matches(".*[A-Z].*")) {
                return ResponseEntity.badRequest().body("Password must contain at least one uppercase letter");
            }
            if (!newPassword.matches(".*[a-z].*")) {
                return ResponseEntity.badRequest().body("Password must contain at least one lowercase letter");
            }
            if (!newPassword.matches(".*[0-9].*")) {
                return ResponseEntity.badRequest().body("Password must contain at least one number");
            }
            if (!newPassword.matches(".*[!@#$%^&*(),.?\":{}|<>].*")) {
                return ResponseEntity.badRequest().body("Password must contain at least one special character");
            }

            user.setPassword(passwordEncoder.encode(newPassword));
            obj.saveUser(user);
            return ResponseEntity.ok("Password changed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }
}