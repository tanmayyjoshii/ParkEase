package com.parking.management.repository;

import com.parking.management.entity.ParkingSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParkingSlotRepository extends JpaRepository<ParkingSlot, Long> {
    List<ParkingSlot> findByIsAvailable(boolean isAvailable);
    Optional<ParkingSlot> findBySlotNumber(String slotNumber);
    boolean existsBySlotNumber(String slotNumber);
    
    @Query("SELECT ps FROM ParkingSlot ps WHERE ps.isAvailable = true")
    List<ParkingSlot> findAvailableSlots();
}
