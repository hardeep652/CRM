package com.example.CRM.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.CRM.model.Lead;
import com.example.CRM.model.Users;

public interface LeadRepo extends JpaRepository<Lead, Long> {
    
        List<Lead> findByAssignedTo(Users user);

}
