package com.example.CRM.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.CRM.model.Client;
import com.example.CRM.model.Lead;
import com.example.CRM.model.Users;
import com.example.CRM.repository.ClientRepo;
import com.example.CRM.repository.LeadRepo;
import com.example.CRM.service.UserService;

@RestController
@RequestMapping("/api/manager")
public class ManagerController {

    @Autowired
    private UserService userService;

    @Autowired
    private LeadRepo leadRepo;

    @Autowired
    private ClientRepo clientRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

        @GetMapping("/leads")
        public ResponseEntity<List<Lead>> getAllLeads() {
            Users manager = userService.getCurrentUser();
            List<Users> teamMembers = manager.getTeamMembers();
            List<Lead> leads = new ArrayList<>();

            for (Users teamMember : teamMembers) {
                List<Lead> memberLeads = leadRepo.findByAssignedTo(teamMember);
                leads.addAll(memberLeads);
            }

            return ResponseEntity.ok(leads);
        }

    @GetMapping("/team-clients")
    public ResponseEntity<List<Client>> getTeamClients() {
        Users manager = userService.getCurrentUser();
        List<Users> teamMembers = manager.getTeamMembers();
        List<Client> clients = new ArrayList<>();

        for (Users teamMember : teamMembers) {
            List<Client> memberClients = clientRepo.findByAssignedTo(teamMember);
            clients.addAll(memberClients);
        }

        return ResponseEntity.ok(clients);
    }

  // ... other imports and class definition ...

  @PostMapping("/approve-or-reject")
  public ResponseEntity<String> processLeadApproval(@RequestBody Map<String, Object> body) {
      Long leadId = Long.valueOf(body.get("leadId").toString());
      String action = body.get("action").toString();

      Lead lead = leadRepo.findById(leadId).orElse(null);

      if (lead == null || lead.getStatus() != Lead.LeadStatus.APPROVAL_PENDING) {
          return ResponseEntity.badRequest().body("❌ Invalid or non-pending lead");
      }

      if ("approve".equalsIgnoreCase(action)) {
          // 1. Create the Client
          Client client = new Client();
          client.setName(lead.getName());
          client.setEmail(lead.getEmail());
          client.setPhone(lead.getPhone());
          client.setCompany(lead.getCompany());
          client.setAssignedTo(lead.getAssignedTo());
          clientRepo.save(client); // Save the new client

          // 2. Update the Lead's status instead of deleting it
          lead.setStatus(Lead.LeadStatus.CONVERTED); // Assuming you have a CONVERTED status in LeadStatus enum
          // Optional: Associate the newly created client with the lead if your Lead model
          // has a client field
          // lead.setClient(client);
          leadRepo.save(lead); // Save the updated lead status

          return ResponseEntity.ok("✅ Lead approved and converted to client");
      } else if ("reject".equalsIgnoreCase(action)) {
          lead.setStatus(Lead.LeadStatus.QUALIFIED); // Or CONTACTED, as per your existing code
          // Optional: Store the rejection reason if you have a field for it
          // lead.setRejectionReason(body.get("rejectionReason").toString());
          leadRepo.save(lead);

          return ResponseEntity.ok("❌ Lead rejected and reverted to QUALIFIED");
      } else {
          return ResponseEntity.badRequest().body("❌ Invalid action. Use 'approve' or 'reject'");
      }
  }

  @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody Map<String, String> passwordData, Authentication authentication) {
        String oldPassword = passwordData.get("oldPassword");
        String newPassword = passwordData.get("newPassword");

        if (oldPassword == null || newPassword == null || oldPassword.isEmpty() || newPassword.isEmpty()) {
            return ResponseEntity.badRequest().body("Old and new passwords are required");
        }

        try {
            Users user = userService.getCurrentUser();
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
            userService.saveUser(user);
            return ResponseEntity.ok("Password changed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }
}