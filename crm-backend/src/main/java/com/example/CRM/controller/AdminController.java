package com.example.CRM.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.CRM.model.Client;
import com.example.CRM.model.Lead;
import com.example.CRM.model.Users;
import com.example.CRM.service.AdminService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "https://crm-snowy-mu.vercel.app")
public class AdminController {
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AdminService adminService;

    @PostMapping("/addEmployee")
    public ResponseEntity<String> addEmployee(@Valid @RequestBody Users u, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.getAllErrors().toString());
        }
        u.setPassword(passwordEncoder.encode(u.getPassword()));
        adminService.saveUser(u);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("The employee was added successfully: " + u.getName());
    }

    @PutMapping("/updateEmployee/{id}")
    public ResponseEntity<String> updateEmployee(@PathVariable Long id, @Valid @RequestBody Users updatedUser, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.getAllErrors().toString());
        }

        Users existingUser = adminService.getUserById(id);
        if (existingUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Employee with ID " + id + " not found");
        }

        // Update fields only if they are provided in the request
        if (updatedUser.getName() != null) {
            existingUser.setName(updatedUser.getName());
        }
        if (updatedUser.getEmail() != null) {
            existingUser.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getPhone_number() != 0) {
            existingUser.setPhone_number(updatedUser.getPhone_number());
        }
        if (updatedUser.getAddress() != null) {
            existingUser.setAddress(updatedUser.getAddress());
        }
        if (updatedUser.getUsername() != null) {
            existingUser.setUsername(updatedUser.getUsername());
        }
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }
        if (updatedUser.getRole() != null) {
            existingUser.setRole(updatedUser.getRole());
        }
        if (updatedUser.getPosition() != null) {
            existingUser.setPosition(updatedUser.getPosition());
        }
        if (updatedUser.getDepartment() != null) {
            existingUser.setDepartment(updatedUser.getDepartment());
        }
        if (updatedUser.getManager() != null) {
            existingUser.setManager(updatedUser.getManager());
        }

        adminService.saveUser(existingUser);
        return ResponseEntity.ok("Employee updated successfully: " + existingUser.getName());
    }

    @GetMapping("/allLeads")
    public ResponseEntity<List<Map<String, Object>>> getAllLeads() {
        List<Lead> leads = adminService.getAllLeads();
        List<Map<String, Object>> response = leads.stream().map(lead -> {
            Map<String, Object> leadMap = new HashMap<>();
            leadMap.put("id", lead.getId());
            leadMap.put("name", lead.getName());
            leadMap.put("email", lead.getEmail());
            leadMap.put("phone", lead.getPhone());
            leadMap.put("company", lead.getCompany());
            leadMap.put("status", lead.getStatus() != null ? lead.getStatus().toString() : null);
            leadMap.put("createdAt", lead.getCreatedAt() != null ? lead.getCreatedAt().toString() : null);
            leadMap.put("updatedAt", lead.getUpdatedAt() != null ? lead.getUpdatedAt().toString() : null);
            leadMap.put("assignedTo", lead.getAssignedTo() != null ? lead.getAssignedTo().getName() : null);
            return leadMap;
        }).toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/allClients")
    public ResponseEntity<List<Map<String, Object>>> getAllClients() {
        List<Client> clients = adminService.getAllClients();
        List<Map<String, Object>> response = clients.stream().map(client -> {
            Map<String, Object> clientMap = new HashMap<>();
            clientMap.put("id", client.getId());
            clientMap.put("name", client.getName());
            clientMap.put("email", client.getEmail());
            clientMap.put("phone", client.getPhone());
            clientMap.put("assignedTo", client.getAssignedTo() != null ? client.getAssignedTo().getName() : null);
            return clientMap;
        }).toList();
        return ResponseEntity.ok(response);
    }

   @GetMapping("/allEmployees")
    public ResponseEntity<List<Map<String, Object>>> getAllEmployees() {
        List<Users> employees = adminService.getAllEmployees();
        List<Map<String, Object>> response = employees.stream().map(employee -> {
            Map<String, Object> employeeMap = new HashMap<>();
            employeeMap.put("id", employee.getId());
            employeeMap.put("name", employee.getName());
            employeeMap.put("email", employee.getEmail());
            employeeMap.put("phone_number", employee.getPhone_number());
            employeeMap.put("address", employee.getAddress());
            employeeMap.put("username", employee.getUsername());
            employeeMap.put("role", employee.getRole());
            employeeMap.put("position", employee.getPosition());
            employeeMap.put("department", employee.getDepartment());
            // Include manager as an object with id and name
            Map<String, Object> managerMap = new HashMap<>();
            if (employee.getManager() != null) {
                managerMap.put("id", employee.getManager().getId());
                managerMap.put("name", employee.getManager().getName());
            } else {
                managerMap = null;
            }
            employeeMap.put("manager", managerMap);
            return employeeMap;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
}