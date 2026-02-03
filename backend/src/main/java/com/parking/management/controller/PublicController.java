package com.parking.management.controller;

import com.parking.management.entity.ParkingSlot;
import com.parking.management.repository.ParkingSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/slots")
public class PublicController {

    @Autowired
    ParkingSlotRepository slotRepository;

    @GetMapping("/available")
    public List<ParkingSlot> getAvailableSlots() {
        return slotRepository.findAvailableSlots();
    }
}
