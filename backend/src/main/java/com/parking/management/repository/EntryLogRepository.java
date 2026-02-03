package com.parking.management.repository;

import com.parking.management.entity.EntryLog;
import com.parking.management.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EntryLogRepository extends JpaRepository<EntryLog, Long> {
    List<EntryLog> findByBooking(Booking booking);
    List<EntryLog> findByBookingOrderByCreatedAtDesc(Booking booking);
}
