package com.example.CRM.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.CRM.model.Client;
import com.example.CRM.model.Lead;
import com.example.CRM.model.Users;
import com.example.CRM.repository.AdminRepo;
import com.example.CRM.repository.ClientRepo;
import com.example.CRM.repository.LeadRepo;
import com.example.CRM.repository.UserRepo;
@Service
public class AdminService  {

    @Autowired
    private AdminRepo adminRepo;

    @Autowired
    private LeadRepo leadRepo;

    @Autowired
    private ClientRepo clientRepo;

    public void saveUser(Users u) {
        adminRepo.save(u);
    }

    public List<Lead> getAllLeads() {
        return leadRepo.findAll();
    }

    public List<Client> getAllClients() {
        return clientRepo.findAll();
    }
}
