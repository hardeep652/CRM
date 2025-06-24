package com.example.CRM.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.CRM.model.Client;
import com.example.CRM.model.Lead;
import com.example.CRM.model.Users;
import com.example.CRM.repository.LeadRepo;

@Service
public class LeadService {

    @Autowired
    private LeadRepo leadRepo;

    @Autowired
    private ClientService clientService;

    public void saveLead(Lead l) {
        LocalDateTime now = LocalDateTime.now();
        l.setCreatedAt(now);
        l.setUpdatedAt(now);
        leadRepo.save(l);
    }

    public List<Lead> getLeadsByAssignedTo(Users u) {
        return leadRepo.findByAssignedTo(u);
    }

    public Lead getleadById(Long id) {
        return leadRepo.findById(id).orElse(null);
    }

    public void deleteLead(Lead l) {
        leadRepo.delete(l);
    }

    /**
     * Same logic as your controller's updateLead — just moved here.
     */
    public String updateLeadForUser(Lead leadPatch, Users currentUser) {
        List<Lead> employeeLeads = getLeadsByAssignedTo(currentUser);

        for (Lead existingLead : employeeLeads) {
            if (existingLead.getId().equals(leadPatch.getId())) {
                // ✅ Partial update — only update provided fields
                if (leadPatch.getName() != null) existingLead.setName(leadPatch.getName());
                if (leadPatch.getEmail() != null) existingLead.setEmail(leadPatch.getEmail());
                if (leadPatch.getPhone() != null) existingLead.setPhone(leadPatch.getPhone());
                if (leadPatch.getCompany() != null) existingLead.setCompany(leadPatch.getCompany());
                if (leadPatch.getStatus() != null) existingLead.setStatus(leadPatch.getStatus());
                existingLead.setUpdatedAt(LocalDateTime.now());

                // ✅ Convert to client if status is CONVERTED
                if (leadPatch.getStatus() == Lead.LeadStatus.CONVERTED) {
                    Client client = new Client();
                    client.setName(existingLead.getName());
                    client.setEmail(existingLead.getEmail());
                    client.setPhone(existingLead.getPhone());
                    client.setCompany(existingLead.getCompany());
                    client.setAddress("N/A");
                    client.setCreatedAt(LocalDateTime.now());
                    client.setAssignedTo(existingLead.getAssignedTo());

                    clientService.saveClient(client);
                    deleteLead(existingLead); // delete lead after conversion

                    return "Lead converted to client and deleted successfully.";
                } else {
                    saveLead(existingLead); // Save updated lead
                    return "Lead updated successfully.";
                }
            }
        }

        return "You are not authorized to update this lead or lead not found.";
    }
}
