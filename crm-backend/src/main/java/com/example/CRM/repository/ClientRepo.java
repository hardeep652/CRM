package com.example.CRM.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.CRM.model.Client;
import com.example.CRM.model.Users;

@Repository
public interface ClientRepo extends JpaRepository<Client, Long> {
    // Define any custom query methods if needed
            List<Client> findByAssignedTo(Users user);


}
