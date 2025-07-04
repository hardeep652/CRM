    package com.example.CRM.repository;

    import java.util.Optional;

    import org.springframework.data.jpa.repository.JpaRepository;

    import com.example.CRM.model.Users;

    public interface UserRepo extends JpaRepository<Users, Long> {
        // Additional query methods can be defined here if needed
            Optional<Users> findByUsername(String username);  // instead of findByEmail


    }
