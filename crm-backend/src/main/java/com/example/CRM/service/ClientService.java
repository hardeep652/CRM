package com.example.CRM.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.CRM.model.Client;
import com.example.CRM.model.Users;
import com.example.CRM.repository.ClientRepo;

@Service
public class ClientService {

    @Autowired 
    private ClientRepo clientRepo;

    public void saveClient(Client client)
    {
        // Set the createdAt timestamp to the current time
        LocalDateTime now = LocalDateTime.now();
        client.setCreatedAt(now);
        // Save the client to the repository
        clientRepo.save(client);
    }

    public List<Client> getClientsByAssignedTo(Users dummy) {
        // TODO Auto-generated method stub
        return clientRepo.findByAssignedTo(dummy);}
}
