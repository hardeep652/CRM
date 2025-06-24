package com.example.CRM.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.CRM.model.Task;
import com.example.CRM.model.Users;

@Repository
public interface TaskRepo extends JpaRepository<Task, Long> {
    // Define any custom query methods if needed
    // For example, you can add methods to find tasks by status, assigned user, etc.

      List<Task> findByAssignedTo(Users user);
}
