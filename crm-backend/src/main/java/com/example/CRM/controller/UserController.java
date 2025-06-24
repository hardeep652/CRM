package com.example.CRM.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    private UserService  obj;
    
  @PostMapping("/newEmployee")
public ResponseEntity<String> addEmployee(@Valid @RequestBody Users u, BindingResult result) {
    // 🔍 Check if there are validation errors
    if (result.hasErrors()) {
        // 💡 Return all validation errors
        return ResponseEntity.badRequest().body(result.getAllErrors().toString());
    }

    // ✅ Save the user if validation passes
    obj.saveUser(u);  // assuming this is your service
    return ResponseEntity.status(HttpStatus.CREATED)
                         .body("The employee was added successfully: " + u.getName());
}

}
