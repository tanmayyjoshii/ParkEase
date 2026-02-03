package com.parking.management.service;

import com.parking.management.entity.Booking;
import com.parking.management.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
    
    public List<Booking> getBookingsByDateRange(LocalDate startDate, LocalDate endDate) {
        return bookingRepository.findByDateBetween(startDate, endDate);
    }
    
    public List<Booking> getActiveBookings() {
        return bookingRepository.findActiveBookings();
    }
} 