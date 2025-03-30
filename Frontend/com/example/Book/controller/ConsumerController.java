package com.example.Book.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Book.model.Consumer;
import com.example.Book.repository.ConsumerRepository;
import com.example.Book.exception.ResourceNotFoundException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/consumers")
@CrossOrigin(origins = "http://localhost:3000")
public class ConsumerController {
    
    private static final Logger logger = LoggerFactory.getLogger(ConsumerController.class);

    @Autowired
    private ConsumerRepository consumerRepository;

    // Get consumer by ID
    @GetMapping("/{id}")
    public ResponseEntity<Consumer> getConsumerById(@PathVariable Long id) {
        logger.info("Fetching consumer with id: {}", id);
        
        Consumer consumer = consumerRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Consumer not found with id: {}", id);
                    return new ResourceNotFoundException("Consumer not found with id: " + id);
                });
        
        // Hide password from response
        consumer.setPassword(null);
        
        logger.info("Successfully retrieved consumer with id: {}", id);
        return ResponseEntity.ok(consumer);
    }

    // Update consumer details
    @PutMapping("/{id}")
    public ResponseEntity<Consumer> updateConsumer(@PathVariable Long id, @RequestBody Consumer consumerDetails) {
        logger.info("Updating consumer with id: {}", id);
        
        Consumer consumer = consumerRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Consumer not found with id: {}", id);
                    return new ResourceNotFoundException("Consumer not found with id: " + id);
                });
        
        // Update consumer fields
        consumer.setUsername(consumerDetails.getUsername());
        consumer.setEmail(consumerDetails.getEmail());
        consumer.setPhone(consumerDetails.getPhone());
        consumer.setAddress(consumerDetails.getAddress());
        consumer.setStatus(consumerDetails.getStatus());
        consumer.setNotes(consumerDetails.getNotes());
        
        // Don't update password through this endpoint
        
        Consumer updatedConsumer = consumerRepository.save(consumer);
        
        // Hide password from response
        updatedConsumer.setPassword(null);
        
        logger.info("Successfully updated consumer with id: {}", id);
        return ResponseEntity.ok(updatedConsumer);
    }
    
    // For testing purposes - get all consumers
    @GetMapping
    public ResponseEntity<Iterable<Consumer>> getAllConsumers() {
        logger.info("Fetching all consumers");
        Iterable<Consumer> consumers = consumerRepository.findAll();
        
        // Hide passwords
        consumers.forEach(consumer -> consumer.setPassword(null));
        
        return ResponseEntity.ok(consumers);
    }
} 