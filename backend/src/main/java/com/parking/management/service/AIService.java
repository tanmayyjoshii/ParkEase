package com.parking.management.service;

import com.parking.management.entity.SensorData;
import com.parking.management.entity.Booking;
import com.parking.management.entity.ParkingSlot;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AIService {
    
    @Autowired
    private SensorDataService sensorDataService;
    
    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private ParkingSlotService parkingSlotService;
    
    /**
     * Predict parking demand for the next 24 hours
     */
    public Map<String, Object> predictParkingDemand() {
        Map<String, Object> predictions = new HashMap<>();
        
        // Get historical booking data
        List<Booking> historicalBookings = bookingService.getAllBookings();
        
        // Analyze patterns by hour of day
        Map<Integer, Long> hourlyDemand = historicalBookings.stream()
            .collect(Collectors.groupingBy(
                booking -> booking.getStartTime().getHour(),
                Collectors.counting()
            ));
        
        // Predict next 24 hours
        List<Map<String, Object>> hourlyPredictions = new ArrayList<>();
        for (int hour = 0; hour < 24; hour++) {
            Map<String, Object> hourPrediction = new HashMap<>();
            hourPrediction.put("hour", hour);
            hourPrediction.put("predictedDemand", hourlyDemand.getOrDefault(hour, 0L));
            hourPrediction.put("confidence", calculateConfidence(hourlyDemand.getOrDefault(hour, 0L)));
            hourlyPredictions.add(hourPrediction);
        }
        
        predictions.put("hourlyPredictions", hourlyPredictions);
        predictions.put("totalPredictedBookings", hourlyPredictions.stream()
            .mapToLong(p -> (Long) p.get("predictedDemand"))
            .sum());
        
        return predictions;
    }
    
    /**
     * Detect anomalies in sensor data
     */
    public List<Map<String, Object>> detectAnomalies() {
        List<Map<String, Object>> anomalies = new ArrayList<>();
        
        // Get recent sensor data
        List<SensorData> recentData = sensorDataService.getRecentSensorData(24); // Last 24 hours
        
        // Group by sensor type and detect outliers
        Map<String, List<SensorData>> dataByType = recentData.stream()
            .collect(Collectors.groupingBy(SensorData::getSensorType));
        
        for (Map.Entry<String, List<SensorData>> entry : dataByType.entrySet()) {
            String sensorType = entry.getKey();
            List<SensorData> sensorData = entry.getValue();
            
            if (sensorData.size() > 10) { // Need sufficient data for anomaly detection
                List<SensorData> outliers = detectOutliers(sensorData);
                
                for (SensorData outlier : outliers) {
                    Map<String, Object> anomaly = new HashMap<>();
                    anomaly.put("sensorType", sensorType);
                    anomaly.put("deviceId", outlier.getDevice().getDeviceId());
                    anomaly.put("value", outlier.getValue());
                    anomaly.put("timestamp", outlier.getTimestamp());
                    anomaly.put("severity", calculateAnomalySeverity(outlier, sensorData));
                    anomalies.add(anomaly);
                }
            }
        }
        
        return anomalies;
    }
    
    /**
     * Optimize parking slot allocation using ML
     */
    public Map<String, Object> optimizeSlotAllocation() {
        Map<String, Object> optimization = new HashMap<>();
        
        // Get current parking slots and their usage patterns
        List<ParkingSlot> slots = parkingSlotService.getAllSlots();
        List<Booking> bookings = bookingService.getAllBookings();
        
        // Calculate slot efficiency scores
        Map<Long, Double> slotEfficiency = new HashMap<>();
        for (ParkingSlot slot : slots) {
            double efficiency = calculateSlotEfficiency(slot, bookings);
            slotEfficiency.put(slot.getId(), efficiency);
        }
        
        // Recommend slot improvements
        List<Map<String, Object>> recommendations = new ArrayList<>();
        for (ParkingSlot slot : slots) {
            double efficiency = slotEfficiency.get(slot.getId());
            
            if (efficiency < 0.6) { // Low efficiency slot
                Map<String, Object> recommendation = new HashMap<>();
                recommendation.put("slotId", slot.getId());
                recommendation.put("slotNumber", slot.getSlotNumber());
                recommendation.put("currentEfficiency", efficiency);
                recommendation.put("suggestedImprovements", generateImprovementSuggestions(slot, bookings));
                recommendations.add(recommendation);
            }
        }
        
        optimization.put("slotEfficiency", slotEfficiency);
        optimization.put("recommendations", recommendations);
        optimization.put("averageEfficiency", slotEfficiency.values().stream()
            .mapToDouble(Double::doubleValue)
            .average()
            .orElse(0.0));
        
        return optimization;
    }
    
    /**
     * Predict maintenance needs for IoT devices
     */
    public List<Map<String, Object>> predictMaintenanceNeeds() {
        List<Map<String, Object>> maintenancePredictions = new ArrayList<>();
        
        // Analyze device health metrics
        List<SensorData> deviceHealthData = sensorDataService.getRecentSensorData(168); // Last week
        
        // Group by device and analyze patterns
        Map<Long, List<SensorData>> dataByDevice = deviceHealthData.stream()
            .collect(Collectors.groupingBy(data -> data.getDevice().getId()));
        
        for (Map.Entry<Long, List<SensorData>> entry : dataByDevice.entrySet()) {
            Long deviceId = entry.getKey();
            List<SensorData> deviceData = entry.getValue();
            
            // Analyze battery levels, signal strength, error rates
            double maintenanceScore = calculateMaintenanceScore(deviceData);
            
            if (maintenanceScore > 0.7) { // High maintenance probability
                Map<String, Object> prediction = new HashMap<>();
                prediction.put("deviceId", deviceId);
                prediction.put("deviceName", deviceData.get(0).getDevice().getDeviceName());
                prediction.put("maintenanceScore", maintenanceScore);
                prediction.put("predictedMaintenanceDate", LocalDateTime.now().plusDays(7));
                prediction.put("recommendedActions", generateMaintenanceActions(deviceData));
                maintenancePredictions.add(prediction);
            }
        }
        
        return maintenancePredictions;
    }
    
    /**
     * Generate dynamic pricing recommendations
     */
    public Map<String, Object> generateDynamicPricing() {
        Map<String, Object> pricing = new HashMap<>();
        
        // Analyze demand patterns and current occupancy
        List<Booking> recentBookings = bookingService.getBookingsByDateRange(
            LocalDate.now().minusDays(30), 
            LocalDate.now()
        );
        
        // Calculate demand elasticity
        Map<String, Double> demandByTimeSlot = new HashMap<>();
        for (Booking booking : recentBookings) {
            String timeSlot = String.format("%02d:00", booking.getStartTime().getHour());
            demandByTimeSlot.merge(timeSlot, 1.0, Double::sum);
        }
        
        // Generate pricing recommendations
        List<Map<String, Object>> pricingRecommendations = new ArrayList<>();
        for (Map.Entry<String, Double> entry : demandByTimeSlot.entrySet()) {
            String timeSlot = entry.getKey();
            Double demand = entry.getValue();
            
            Map<String, Object> recommendation = new HashMap<>();
            recommendation.put("timeSlot", timeSlot);
            recommendation.put("currentDemand", demand);
            recommendation.put("suggestedPriceMultiplier", calculatePriceMultiplier(demand));
            recommendation.put("reasoning", generatePricingReasoning(demand));
            pricingRecommendations.add(recommendation);
        }
        
        pricing.put("pricingRecommendations", pricingRecommendations);
        pricing.put("analysisPeriod", "Last 30 days");
        
        return pricing;
    }
    
    // Helper methods
    private double calculateConfidence(Long demand) {
        // Simple confidence calculation based on data availability
        return Math.min(0.95, 0.5 + (demand * 0.01));
    }
    
    private List<SensorData> detectOutliers(List<SensorData> data) {
        // Simple outlier detection using IQR method
        List<Double> values = data.stream()
            .map(SensorData::getValue)
            .sorted()
            .collect(Collectors.toList());
        
        int n = values.size();
        double q1 = values.get(n / 4);
        double q3 = values.get(3 * n / 4);
        double iqr = q3 - q1;
        double lowerBound = q1 - 1.5 * iqr;
        double upperBound = q3 + 1.5 * iqr;
        
        return data.stream()
            .filter(d -> d.getValue() < lowerBound || d.getValue() > upperBound)
            .collect(Collectors.toList());
    }
    
    private String calculateAnomalySeverity(SensorData outlier, List<SensorData> allData) {
        double mean = allData.stream()
            .mapToDouble(SensorData::getValue)
            .average()
            .orElse(0.0);
        
        double deviation = Math.abs(outlier.getValue() - mean) / mean;
        
        if (deviation > 0.5) return "HIGH";
        else if (deviation > 0.2) return "MEDIUM";
        else return "LOW";
    }
    
    private double calculateSlotEfficiency(ParkingSlot slot, List<Booking> bookings) {
        // Calculate how efficiently a slot is used
        List<Booking> slotBookings = bookings.stream()
            .filter(b -> b.getParkingSlot().getId().equals(slot.getId()))
            .collect(Collectors.toList());
        
        if (slotBookings.isEmpty()) return 0.0;
        
        // Consider factors like booking duration, frequency, revenue
        double totalHours = slotBookings.stream()
            .mapToDouble(b -> {
                LocalTime start = b.getStartTime();
                LocalTime end = b.getEndTime();
                return Math.abs(end.getHour() - start.getHour());
            })
            .sum();
        
        return Math.min(1.0, totalHours / (slotBookings.size() * 24.0));
    }
    
    private List<String> generateImprovementSuggestions(ParkingSlot slot, List<Booking> bookings) {
        List<String> suggestions = new ArrayList<>();
        
        // Analyze booking patterns for this slot
        List<Booking> slotBookings = bookings.stream()
            .filter(b -> b.getParkingSlot().getId().equals(slot.getId()))
            .collect(Collectors.toList());
        
        if (slotBookings.isEmpty()) {
            suggestions.add("Consider promotional pricing to increase usage");
            suggestions.add("Review slot location and accessibility");
        } else {
            suggestions.add("Optimize pricing based on demand patterns");
            suggestions.add("Consider time-based availability adjustments");
        }
        
        return suggestions;
    }
    
    private double calculateMaintenanceScore(List<SensorData> deviceData) {
        // Analyze various health indicators
        double batteryScore = deviceData.stream()
            .filter(d -> d.getSensorType().equals(SensorData.SensorTypes.BATTERY_LEVEL))
            .mapToDouble(SensorData::getValue)
            .average()
            .orElse(100.0) / 100.0;
        
        double signalScore = deviceData.stream()
            .filter(d -> d.getSensorType().equals(SensorData.SensorTypes.SIGNAL_STRENGTH))
            .mapToDouble(SensorData::getValue)
            .average()
            .orElse(100.0) / 100.0;
        
        return (batteryScore + signalScore) / 2.0;
    }
    
    private List<String> generateMaintenanceActions(List<SensorData> deviceData) {
        List<String> actions = new ArrayList<>();
        
        double avgBattery = deviceData.stream()
            .filter(d -> d.getSensorType().equals(SensorData.SensorTypes.BATTERY_LEVEL))
            .mapToDouble(SensorData::getValue)
            .average()
            .orElse(100.0);
        
        if (avgBattery < 20.0) {
            actions.add("Replace battery");
        }
        
        actions.add("Schedule preventive maintenance");
        actions.add("Update firmware if available");
        
        return actions;
    }
    
    private double calculatePriceMultiplier(Double demand) {
        // Simple dynamic pricing logic
        if (demand > 50) return 1.5; // High demand - increase price
        else if (demand > 20) return 1.2; // Medium demand - slight increase
        else if (demand < 5) return 0.8; // Low demand - decrease price
        else return 1.0; // Normal demand - standard price
    }
    
    private String generatePricingReasoning(Double demand) {
        if (demand > 50) return "High demand period - premium pricing recommended";
        else if (demand > 20) return "Moderate demand - slight price increase";
        else if (demand < 5) return "Low demand - promotional pricing to attract customers";
        else return "Normal demand - standard pricing";
    }
} 