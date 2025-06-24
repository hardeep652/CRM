package com.example.CRM.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "employees")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Column(unique = true)
    private String email;

    @Min(value = 1000000000L, message = "Phone number must have at least 10 digits")
    @Max(value = 9999999999L, message = "Phone number cannot exceed 10 digits")
    @Column(unique = true)  // ✅ Added unique constraint
    private double phone_number;

    @Size(max = 200, message = "Address cannot exceed 200 characters")
    private String address;

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Column(unique = true)
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    @NotBlank(message = "Role is required")
    private String role;

    @Size(max = 50, message = "Position cannot exceed 50 characters")
    private String position;

    @Size(max = 50, message = "Department cannot exceed 50 characters")
    private String department;


    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public double getPhone_number() {
        return phone_number;
    }
    public void setPhone_number(double phone_number) {
        this.phone_number = phone_number;
    }
    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public String getPosition() {
        return position;
    }
    public void setPosition(String position) {
        this.position = position;
    }
    public String getDepartment() {
        return department;
    }
    public void setDepartment(String department) {
        this.department = department;
    }
    
    @Override
    public String toString() {
        return "User [id=" + id + ", name=" + name + ", email=" + email + ", phone_number=" + phone_number
                + ", address=" + address + ", username=" + username + ", password=" + password + ", role=" + role
                + ", position=" + position + ", department=" + department + ", getId()=" + getId() + ", getName()="
                + getName() + ", getEmail()=" + getEmail() + ", getPhone_number()=" + getPhone_number()
                + ", getAddress()=" + getAddress() + ", getUsername()=" + getUsername() + ", getClass()=" + getClass()
                + ", getPassword()=" + getPassword() + ", getRole()=" + getRole() + ", getPosition()=" + getPosition()
                + ", getDepartment()=" + getDepartment() + ", hashCode()=" + hashCode() + ", toString()="
                + super.toString() + "]";
    }

    
    
}
