package com.example.Book;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;

import com.example.Book.model.Consumer;
import com.example.Book.repository.ConsumerRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
public class BookApplication {
    
    private static final Logger logger = LoggerFactory.getLogger(BookApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(BookApplication.class, args);
    }
    
    /**
     * Initialize the database with some test data.
     * Only runs when profile is "dev"
     */
    @Bean
    @Profile("dev")
    public CommandLineRunner initDatabase(ConsumerRepository consumerRepository) {
        return args -> {
            logger.info("Initializing database with test data...");
            
            // Check if we already have users
            if (consumerRepository.count() == 0) {
                // Create test users
                Consumer testUser1 = new Consumer();
                testUser1.setUsername("John Doe");
                testUser1.setEmail("john@example.com");
                testUser1.setPassword("password123"); // In production, this should be encrypted
                testUser1.setPhone("1234567890");
                testUser1.setAddress("{\"country\":\"USA\",\"city\":\"New York\",\"district\":\"Manhattan\",\"postalCode\":\"10001\"}");
                testUser1.setStatus("active");
                testUser1.setNotes("Test user with complete profile");
                
                Consumer testUser2 = new Consumer();
                testUser2.setUsername("Jane Smith");
                testUser2.setEmail("jane@example.com");
                testUser2.setPassword("password123"); // In production, this should be encrypted
                testUser2.setPhone("0987654321");
                testUser2.setStatus("inactive");
                
                // Save the test users
                consumerRepository.save(testUser1);
                consumerRepository.save(testUser2);
                
                logger.info("Added test users to the database");
            } else {
                logger.info("Database already contains users, skipping initialization");
            }
        };
    }
} 