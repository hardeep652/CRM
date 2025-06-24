package com.example.CRM.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.CRM.model.Users;
import com.example.CRM.repository.UserRepo;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    public void saveUser(Users u) {
        userRepo.save(u);
    }

    /**
     * Get the currently logged-in user based on Spring Security's context.
     */
    public Users getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User not found with username: " + username));
    }
}
