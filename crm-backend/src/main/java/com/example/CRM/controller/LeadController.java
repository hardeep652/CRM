package com.example.CRM.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import com.example.CRM.model.Client;
import com.example.CRM.model.Lead;
import com.example.CRM.model.Users;
import com.example.CRM.service.ClientService;
import com.example.CRM.service.LeadService;
import com.example.CRM.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/leads")
public class LeadController {

    @Autowired
    private LeadService leadService;

    @Autowired
    private UserService userService;

    @PostMapping("/newLead")
    public ResponseEntity<?> generateLead(
            @Valid @RequestBody Lead lead,
            BindingResult result) {

        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(
                    error -> errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        Users currentUser = userService.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("User not logged in");
        }

        lead.setAssignedTo(currentUser);  
        leadService.saveLead(lead);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("The lead was created successfully: " + lead.getName());
    }

    @GetMapping("/myLeads")
    public ResponseEntity<List<Map<String, Object>>> getMyLeads() {
        Users currentUser = userService.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        List<Map<String, Object>> response = new ArrayList<>();
        leadService.getLeadsByAssignedTo(currentUser).forEach(l -> {
            Map<String, Object> leadMap = new HashMap<>();
            leadMap.put("id", l.getId());
            leadMap.put("name", l.getName());
            leadMap.put("email", l.getEmail());
            leadMap.put("phone", l.getPhone());
            leadMap.put("company", l.getCompany());
            leadMap.put("status", l.getStatus());
            leadMap.put("createdAt", l.getCreatedAt());
            leadMap.put("updatedAt", l.getUpdatedAt());
            leadMap.put("assignedToName", l.getAssignedTo().getName());
            response.add(leadMap);
        });

        return ResponseEntity.ok(response);
    }

    @PutMapping("/updateLead")
    public ResponseEntity<String> updateLead(@RequestBody Lead leadPatch) {
        Users currentUser = userService.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("User not logged in");
        }
        if (leadPatch.getId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Lead ID is required for update");
        }

        String resultMessage = leadService.updateLeadForUser(leadPatch, currentUser);
        return ResponseEntity.ok(resultMessage);
    }
}
