package com.example.Book.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Book.model.Consumer;

@Repository
public interface ConsumerRepository extends JpaRepository<Consumer, Long> {
    // Find consumer by email
    Consumer findByEmail(String email);
    
    // Find consumer by username
    Consumer findByUsername(String username);
} 