package com.parking.management.controller;

import com.parking.management.repository.BookingRepository;
import com.parking.management.repository.ParkingSlotRepository;
import com.parking.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    BookingRepository bookingRepository;

    @Autowired
    ParkingSlotRepository slotRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping("/reports")
    public Map<String, Object> getReports() {
        Map<String, Object> reports = new HashMap<>();
        
        // Total counts
        reports.put("totalUsers", userRepository.count());
        reports.put("totalSlots", slotRepository.count());
        reports.put("totalBookings", bookingRepository.count());
        reports.put("availableSlots", slotRepository.findAvailableSlots().size());
        
        // Today's bookings
        LocalDate today = LocalDate.now();
        reports.put("todayBookings", bookingRepository.countBookingsByDate(today));
        
        // This month's bookings
        LocalDate startOfMonth = today.withDayOfMonth(1);
        LocalDate endOfMonth = today.withDayOfMonth(today.lengthOfMonth());
        reports.put("monthlyBookings", bookingRepository.countBookingsByDateRange(startOfMonth, endOfMonth));
        
        return reports;
    }
}
