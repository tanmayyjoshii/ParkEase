package com.parking.management.controller;

import com.parking.management.dto.BookingRequest;
import com.parking.management.dto.BookingResponse;
import com.parking.management.entity.Booking;
import com.parking.management.entity.EntryLog;
import com.parking.management.entity.ParkingSlot;
import com.parking.management.entity.User;
import com.parking.management.repository.BookingRepository;
import com.parking.management.repository.EntryLogRepository;
import com.parking.management.repository.ParkingSlotRepository;
import com.parking.management.repository.UserRepository;
import com.parking.management.security.UserPrincipal;
import com.parking.management.service.QRCodeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class BookingController {

    @Autowired
    ParkingSlotRepository slotRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    BookingRepository bookingRepository;

    @Autowired
    EntryLogRepository entryLogRepository;

    @Autowired
    QRCodeService qrCodeService;

    @PostMapping("/slots/book")
    public ResponseEntity<?> bookSlot(@Valid @RequestBody BookingRequest bookingRequest, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Optional<User> userOptional = userRepository.findById(userPrincipal.getId());
        Optional<ParkingSlot> slotOptional = slotRepository.findById(bookingRequest.getSlotId());

        if (userOptional.isEmpty() || slotOptional.isEmpty() || !slotOptional.get().getIsAvailable()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        ParkingSlot slot = slotOptional.get();
        slot.setIsAvailable(false);
        slotRepository.save(slot);

        Booking booking = new Booking(userOptional.get(), slot, bookingRequest.getDate(), bookingRequest.getStartTime(), bookingRequest.getEndTime());
        booking = bookingRepository.save(booking);
        
        try {
            String qrCode = qrCodeService.generateQRCodeImage(String.valueOf(booking.getId()), 200, 200);
            booking.setQrCode(qrCode);
            booking = bookingRepository.save(booking);
        } catch (Exception e) {
            // Handle QR generation error
        }

        return new ResponseEntity<>(new BookingResponse(booking), HttpStatus.CREATED);
    }

    @GetMapping("/slots/my-bookings")
    public List<BookingResponse> getMyBookings(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        List<Booking> bookings = bookingRepository.findByUserOrderByCreatedAtDesc(userRepository.findById(userPrincipal.getId()).orElse(null));
        return bookings.stream().map(BookingResponse::new).collect(Collectors.toList());
    }

    @GetMapping("/admin/bookings")
    public List<BookingResponse> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        return bookings.stream().map(BookingResponse::new).collect(Collectors.toList());
    }

    @GetMapping("/slots/booking/{bookingId}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable Long bookingId) {
        Optional<Booking> bookingOptional = bookingRepository.findById(bookingId);
        if (bookingOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        
        return new ResponseEntity<>(new BookingResponse(bookingOptional.get()), HttpStatus.OK);
    }

    @PostMapping("/slots/generate-qr")
    public ResponseEntity<String> generateQR(@RequestBody Long bookingId) {
        Optional<Booking> bookingOptional = bookingRepository.findById(bookingId);
        if (bookingOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        try {
            Booking booking = bookingOptional.get();
            BookingResponse bookingResponse = new BookingResponse(booking);
            String qrCode = qrCodeService.generateQRCodeImageForBooking(bookingResponse, 200, 200);
            booking.setQrCode(qrCode);
            bookingRepository.save(booking);
            return new ResponseEntity<>(qrCode, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
