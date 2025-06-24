package com.example.CRM.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.CRM.model.Users;

public interface AdminRepo extends JpaRepository<Users, Long> {
    // This interface will automatically inherit methods for CRUD operations
    // from JpaRepository, such as save(), findById(), deleteById(), etc.

}
