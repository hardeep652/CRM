package com.example.CRM.service;

import com.example.CRM.model.Users;
import com.example.CRM.repository.UserRepo;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsersDetailsService implements UserDetailsService {

    private final UserRepo usersRepository;

    public UsersDetailsService(UserRepo usersRepository) {
        this.usersRepository = usersRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 🔍 Find by username instead of email
        Users user = usersRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
 System.out.println("DEBUG user in DB => username:" + user.getUsername() +
                       ", password:" + user.getPassword());
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword()) // hashed password
                .authorities(new SimpleGrantedAuthority("ROLE_" + user.getRole().toUpperCase()))
                .build();
    }
}
