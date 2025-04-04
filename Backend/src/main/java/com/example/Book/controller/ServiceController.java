package com.example.Book.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Book.model.Services;
import com.example.Book.service.ServiceService;

@RestController
@RequestMapping("/api/service-providers")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ServiceController {

    @Autowired
    private ServiceService serviceService;

    @GetMapping("/services")
    public ResponseEntity<List<Services>> getProviderServices(Authentication authentication) {
        String email = authentication.getName();
        List<Services> services = serviceService.getServicesByProviderEmail(email);
        return ResponseEntity.ok(services);
    }

    @PutMapping("/services")
    public ResponseEntity<Services> updateService(
            @RequestBody Services service,
            Authentication authentication) {
        String email = authentication.getName();
        Services updatedService = serviceService.updateService(email, service);
        return ResponseEntity.ok(updatedService);
    }
} 