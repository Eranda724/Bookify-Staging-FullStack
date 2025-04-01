package com.example.Book.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Book.model.ServiceProvider;
import com.example.Book.repo.ServiceProviderRepository;
import com.example.Book.service.JWTService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/service-providers")
public class ServiceProviderController {

    @Autowired
    private ServiceProviderRepository serviceProviderRepository;

    @Autowired
    private JWTService jwtService;

    @GetMapping("/profile")
    public ResponseEntity<?> getServiceProviderProfile(@RequestHeader("Authorization") String token) {
        try {
            if (token == null || token.isEmpty()) {
                return ResponseEntity.status(401).body("No authorization token provided");
            }

            // Remove "Bearer " prefix if present
            String actualToken = token.startsWith("Bearer ") ? token.substring(7) : token;
            
            // Extract email from token
            String userEmail = jwtService.extractUserName(actualToken);
            if (userEmail == null || userEmail.isEmpty()) {
                return ResponseEntity.status(401).body("Invalid token: Could not extract email");
            }
            
            System.out.println("Fetching profile for email: " + userEmail);
            
            // Find service provider by email
            Optional<ServiceProvider> provider = serviceProviderRepository.findByEmail(userEmail);
            
            if (provider.isPresent()) {
                ServiceProvider sp = provider.get();
                Map<String, Object> response = Map.of(
                    "username", sp.getUsername() != null ? sp.getUsername() : "",
                    "email", sp.getEmail() != null ? sp.getEmail() : "",
                    "address", sp.getAddress() != null ? sp.getAddress() : "",
                    "contact", sp.getContact() != null ? sp.getContact() : "",
                    "experience", sp.getExperience() != null ? sp.getExperience() : 0,
                    "isActive", sp.getIsActive() != null ? sp.getIsActive() : false
                );
                System.out.println("Found provider profile: " + response);
                return ResponseEntity.ok(response);
            }
            
            System.out.println("No provider found for email: " + userEmail);
            return ResponseEntity.status(404).body("Service provider not found");
        } catch (Exception e) {
            System.err.println("Error in getServiceProviderProfile: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }
} 