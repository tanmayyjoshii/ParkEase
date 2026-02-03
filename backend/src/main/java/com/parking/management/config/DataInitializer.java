package com.parking.management.config;

import com.parking.management.entity.ParkingSlot;
import com.parking.management.entity.User;
import com.parking.management.repository.ParkingSlotRepository;
import com.parking.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ParkingSlotRepository parkingSlotRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize admin user if not exists
        if (!userRepository.findByEmail("admin@gmail.com").isPresent()) {
            User adminUser = new User();
            adminUser.setName("Admin User");
            adminUser.setEmail("admin@gmail.com");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setRole(User.Role.ADMIN);
            adminUser.setCreatedAt(LocalDateTime.now());
            adminUser.setUpdatedAt(LocalDateTime.now());
            userRepository.save(adminUser);
            System.out.println("Admin user created successfully");
        }

        // Initialize parking slots if none exist
        if (parkingSlotRepository.count() == 0) {
            createParkingSlots();
            System.out.println("Parking slots created successfully");
        }
    }

    private void createParkingSlots() {
        LocalDateTime now = LocalDateTime.now();
        
        ParkingSlot[] slots = {
            new ParkingSlot("A1", "Ground Floor - Near Entrance"),
            new ParkingSlot("A2", "Ground Floor - Near Entrance"),
            new ParkingSlot("B1", "Basement Level 1"),
            new ParkingSlot("B2", "Basement Level 1"),
            new ParkingSlot("C1", "Ground Floor - Back Area"),
            new ParkingSlot("C2", "Ground Floor - Back Area"),
            new ParkingSlot("D1", "Basement Level 2"),
            new ParkingSlot("D2", "Basement Level 2"),
            new ParkingSlot("E1", "Ground Floor - Side Area"),
            new ParkingSlot("E2", "Ground Floor - Side Area")
        };

        for (ParkingSlot slot : slots) {
            slot.setIsAvailable(true);
            slot.setDescription("Standard parking spot");
            slot.setCreatedAt(now);
            slot.setUpdatedAt(now);
            parkingSlotRepository.save(slot);
        }
    }
} 