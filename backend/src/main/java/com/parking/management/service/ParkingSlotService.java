package com.parking.management.service;

import com.parking.management.entity.ParkingSlot;
import com.parking.management.repository.ParkingSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ParkingSlotService {
    
    @Autowired
    private ParkingSlotRepository parkingSlotRepository;
    
    public List<ParkingSlot> getAllSlots() {
        return parkingSlotRepository.findAll();
    }
    
    public List<ParkingSlot> getAvailableSlots() {
        return parkingSlotRepository.findAvailableSlots();
    }
    
    public ParkingSlot getSlotById(Long id) {
        return parkingSlotRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Slot not found: " + id));
    }
} 