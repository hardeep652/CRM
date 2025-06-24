package com.example.CRM.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;


@Entity
@Table(name = "tasks")
public class Task {
    
    public enum TaskStatus {
        TODO,
        IN_PROGRESS,
        COMPLETED
    }
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    private LocalDateTime dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "assigned_to")
    private Users assignedTo;

    @ManyToOne
    @JoinColumn(name = "related_lead", nullable = true)
    private Lead relatedLead;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Users getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(Users assignedTo) {
        this.assignedTo = assignedTo;
    }

    public Lead getRelatedLead() {
        return relatedLead;
    }

    public void setRelatedLead(Lead relatedLead) {
        this.relatedLead = relatedLead;
    }

    @Override
    public String toString() {
        return "Task [id=" + id + ", title=" + title + ", description=" + description + ", status=" + status
                + ", dueDate=" + dueDate + ", createdAt=" + createdAt + ", updatedAt=" + updatedAt + ", assignedTo="
                + assignedTo + ", relatedLead=" + relatedLead + "]";
    }

    // Getters and Setters
    
}
