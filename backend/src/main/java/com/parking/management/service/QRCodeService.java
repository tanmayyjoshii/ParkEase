package com.parking.management.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import com.parking.management.dto.BookingResponse;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class QRCodeService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generateQRCodeImage(String text, int width, int height) throws WriterException, IOException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        Map<EncodeHintType, Object> hints = new HashMap<>();
        hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.L);
        hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");

        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height, hints);

        BufferedImage bufferedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        bufferedImage.createGraphics();

        Graphics2D graphics = (Graphics2D) bufferedImage.getGraphics();
        graphics.setColor(Color.WHITE);
        graphics.fillRect(0, 0, width, height);
        graphics.setColor(Color.BLACK);

        for (int i = 0; i < height; i++) {
            for (int j = 0; j < width; j++) {
                if (bitMatrix.get(j, i)) {
                    graphics.fillRect(j, i, 1, 1);
                }
            }
        }

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(bufferedImage, "png", baos);
        byte[] imageBytes = baos.toByteArray();
        
        return "data:image/png;base64," + Base64.getEncoder().encodeToString(imageBytes);
    }

    public String generateQRCodeImageForBooking(BookingResponse booking, int width, int height) throws WriterException, IOException {
        // Create a JSON object with booking details
        Map<String, Object> qrData = new HashMap<>();
        qrData.put("bookingId", booking.getId());
        qrData.put("slotNumber", booking.getSlotNumber());
        qrData.put("location", booking.getLocation());
        qrData.put("date", booking.getDate().toString());
        qrData.put("startTime", booking.getStartTime().toString());
        qrData.put("endTime", booking.getEndTime().toString());
        qrData.put("status", booking.getStatus().toString());
        qrData.put("type", "PARKING_BOOKING");
        qrData.put("timestamp", System.currentTimeMillis());

        String jsonData = objectMapper.writeValueAsString(qrData);
        
        return generateQRCodeImage(jsonData, width, height);
    }
}
