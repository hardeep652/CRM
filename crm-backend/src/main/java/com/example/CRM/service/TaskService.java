package com.example.CRM.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.CRM.model.Lead;
import com.example.CRM.model.Task;
import com.example.CRM.model.Users;
import com.example.CRM.repository.TaskRepo;

@Service
public class TaskService {

    @Autowired
    private TaskRepo obj;

    @Autowired
    private LeadService leadService;

    /**
     * Creates a new task assigned to logged-in user.
     */
    public String createTask(Task t, Users loggedInUser) {
        if (loggedInUser == null) {
            return "User not found";
        }
        t.setAssignedTo(loggedInUser);

        // Default status
        if (t.getStatus() == null) {
            t.setStatus(Task.TaskStatus.TODO);
        }

        // Validate due date
        if (t.getDueDate() != null && t.getDueDate().isBefore(LocalDateTime.now())) {
            return "Due date cannot be in the past.";
        }

        // Fetch leads assigned to this logged-in user
        List<Lead> leads = leadService.getLeadsByAssignedTo(loggedInUser);
        if (leads.isEmpty()) {
            return "No leads found for the assigned user";
        }

        // Check if provided lead is one of the logged-in user's leads
        boolean leadFound = false;
        for (Lead lead : leads) {
            if (t.getRelatedLead() != null && t.getRelatedLead().getId().equals(lead.getId())) {
                t.setRelatedLead(lead); // attach full lead
                leadFound = true;
                break;
            }
        }

        if (!leadFound) {
            return "Related lead not found for the logged-in user";
        }

        t.setCreatedAt(LocalDateTime.now());
        t.setUpdatedAt(LocalDateTime.now());
        obj.save(t);
        return "The task was created successfully.";
    }

    /**
     * Get tasks assigned to a user.
     */
    public List<Task> getTasksByAssignedTo(Users u) {
        return obj.findByAssignedTo(u);
    }

    public void deleteTask(Task t) {
        obj.delete(t);
    }

  
    /**
     * Updates a task (partial update). Deletes if status is COMPLETED.
     */
    public String updateTask(Task updatedTask, Users loggedInUser) {
        List<Task> tasks = obj.findByAssignedTo(loggedInUser);

        for (Task task : tasks) {
            if (task.getId().equals(updatedTask.getId())) {
                // Delete if completed
                if (updatedTask.getStatus() == Task.TaskStatus.COMPLETED) {
                    obj.delete(task);
                    return "The task was completed and deleted successfully.";
                }

                // Partial updates
                if (updatedTask.getTitle() != null) {
                    task.setTitle(updatedTask.getTitle());
                }
                if (updatedTask.getDescription() != null) {
                    task.setDescription(updatedTask.getDescription());
                }
                if (updatedTask.getStatus() != null) {
                    task.setStatus(updatedTask.getStatus());
                }
                if (updatedTask.getDueDate() != null) {
                    if (updatedTask.getDueDate().isBefore(LocalDateTime.now())) {
                        return "Due date cannot be in the past.";
                    }
                    task.setDueDate(updatedTask.getDueDate());
                }

                task.setUpdatedAt(LocalDateTime.now());
                obj.save(task);
                return "The task was updated successfully.";
            }
        }

        return "Task not found or not assigned to you.";
    }
}
