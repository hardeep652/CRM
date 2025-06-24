package com.example.CRM.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import com.example.CRM.model.Client;
import com.example.CRM.model.Lead;
import com.example.CRM.model.Users;
import com.example.CRM.service.AdminService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
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

   @GetMapping("/allLeads")
public ResponseEntity<List<Map<String, Object>>> getAllLeads() {
    List<Lead> leads = adminService.getAllLeads();

    List<Map<String, Object>> response = leads.stream().map(lead -> {
        Map<String, Object> leadMap = new HashMap<>();
        leadMap.put("id", lead.getId());
        leadMap.put("name", lead.getName());
        leadMap.put("email", lead.getEmail());
        leadMap.put("phone", lead.getPhone());
        // add other lead fields you want
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
        // add other client fields you want
        clientMap.put("assignedTo", client.getAssignedTo() != null ? client.getAssignedTo().getName() : null); 
        return clientMap;
    }).toList();

    return ResponseEntity.ok(response);
}

}
