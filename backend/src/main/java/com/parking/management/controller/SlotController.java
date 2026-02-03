package com.parking.management.controller;

import com.parking.management.entity.ParkingSlot;
import com.parking.management.repository.ParkingSlotRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/slots")
public class SlotController {

    @Autowired
    ParkingSlotRepository slotRepository;

    @GetMapping("")
    public List<ParkingSlot> getAllSlots() {
        return slotRepository.findAll();
    }

    @PostMapping("/add")
    public ResponseEntity<ParkingSlot> createSlot(@Valid @RequestBody ParkingSlot slot) {
        if (slotRepository.existsBySlotNumber(slot.getSlotNumber())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(slotRepository.save(slot), HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ParkingSlot> updateSlot(@PathVariable Long id, @Valid @RequestBody ParkingSlot slotDetails) {
        return slotRepository.findById(id).map(slot -> {
            slot.setLocation(slotDetails.getLocation());
            slot.setIsAvailable(slotDetails.getIsAvailable());
            slot.setDescription(slotDetails.getDescription());
            return new ResponseEntity<>(slotRepository.save(slot), HttpStatus.OK);
        }).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteSlot(@PathVariable Long id) {
        return slotRepository.findById(id).map(slot -> {
            slotRepository.delete(slot);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}
