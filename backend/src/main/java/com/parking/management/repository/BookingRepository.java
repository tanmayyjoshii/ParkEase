package com.parking.management.repository;

import com.parking.management.entity.Booking;
import com.parking.management.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
    List<Booking> findByUserOrderByCreatedAtDesc(User user);
    
    @Query("SELECT b FROM Booking b WHERE b.date = :date AND b.parkingSlot.id = :slotId")
    List<Booking> findByDateAndSlotId(@Param("date") LocalDate date, @Param("slotId") Long slotId);
    
    @Query("SELECT b FROM Booking b WHERE b.status = 'ACTIVE'")
    List<Booking> findActiveBookings();
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.date = :date")
    Long countBookingsByDate(@Param("date") LocalDate date);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.date BETWEEN :startDate AND :endDate")
    Long countBookingsByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT b FROM Booking b WHERE b.date BETWEEN :startDate AND :endDate")
    List<Booking> findByDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
