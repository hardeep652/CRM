package com.example.CRM.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.CRM.model.Client;
import com.example.CRM.model.Users;
import com.example.CRM.service.ClientService;
import com.example.CRM.service.UserService;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    @Autowired
    private ClientService clientService;

    @Autowired
    private UserService userService;  // ✅ Inject UserService to get the logged-in user

    @GetMapping("/myClients")
    public List<Map<String, Object>> getMyClients() {
        // ✅ Get the logged-in user
        Users loggedInUser = userService.getCurrentUser();

        List<Map<String, Object>> response = new ArrayList<>();
        List<Client> clients = clientService.getClientsByAssignedTo(loggedInUser);

        for (Client c : clients) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", c.getId());
            map.put("name", c.getName());
            map.put("email", c.getEmail());
            map.put("phone", c.getPhone());
            map.put("company", c.getCompany());
            map.put("createdAt", c.getCreatedAt());
            map.put("assignedToName", c.getAssignedTo().getName());
            response.add(map);
        }

        return response;
    }
}
