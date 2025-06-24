package com.example.CRM.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.CRM.model.Lead;
import com.example.CRM.model.Task;
import com.example.CRM.model.Users;
import com.example.CRM.service.TaskService;
import com.example.CRM.service.UserService;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserService userService;

    @PostMapping("/newTask")
    public String createTask(@RequestBody Task t) {
        Users loggedInUser = userService.getCurrentUser();
        return taskService.createTask(t, loggedInUser);
    }

    @GetMapping("/myTasks")
    public List<Map<String, Object>> getMyTasks() {
        Users loggedInUser = userService.getCurrentUser();
        if (loggedInUser == null) {
            return List.of();
        }

        List<Task> tasks = taskService.getTasksByAssignedTo(loggedInUser);
        List<Map<String, Object>> response = new ArrayList<>();

        for (Task t : tasks) {
            Map<String, Object> taskMap = new HashMap<>();
            taskMap.put("id", t.getId());
            taskMap.put("title", t.getTitle());
            taskMap.put("description", t.getDescription());
            taskMap.put("status", t.getStatus());
            taskMap.put("dueDate", t.getDueDate());
            taskMap.put("assignedTo", t.getAssignedTo() != null ? t.getAssignedTo().getName() : null);

            if (t.getRelatedLead() != null) {
                taskMap.put("relatedLeadName", t.getRelatedLead().getName());
                taskMap.put("relatedCompany", t.getRelatedLead().getCompany());
            } else {
                taskMap.put("relatedLeadName", null);
                taskMap.put("relatedCompany", null);
            }

            response.add(taskMap);
        }

        return response;
    }

    @PutMapping("/updateTask")
    public String updateTask(@RequestBody Task t) {
        Users loggedInUser = userService.getCurrentUser();
        return taskService.updateTask(t, loggedInUser);
    }
}
