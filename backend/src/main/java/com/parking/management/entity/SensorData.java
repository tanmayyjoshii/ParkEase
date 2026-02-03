package com.parking.management.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sensor_data")
public class SensorData {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "device_id", nullable = false)
    private IoTDevice device;
    
    @Column(nullable = false)
    private String sensorType;
    
    @Column(name = "sensor_value", nullable = false)
    private Double value;
    
    private String unit;
    private String metadata; // JSON string for additional data
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    @Enumerated(EnumType.STRING)
    private DataQuality quality;
    
    // Data Quality Levels
    public enum DataQuality {
        EXCELLENT,  // High confidence data
        GOOD,       // Normal quality data
        FAIR,       // Some uncertainty
        POOR,       // Low quality, may need filtering
        ERROR       // Invalid or corrupted data
    }
    
    // Sensor Types
    public static class SensorTypes {
        public static final String OCCUPANCY = "OCCUPANCY";
        public static final String TEMPERATURE = "TEMPERATURE";
        public static final String HUMIDITY = "HUMIDITY";
        public static final String LIGHT_LEVEL = "LIGHT_LEVEL";
        public static final String AIR_QUALITY = "AIR_QUALITY";
        public static final String NOISE_LEVEL = "NOISE_LEVEL";
        public static final String VIBRATION = "VIBRATION";
        public static final String POWER_CONSUMPTION = "POWER_CONSUMPTION";
        public static final String BATTERY_LEVEL = "BATTERY_LEVEL";
        public static final String SIGNAL_STRENGTH = "SIGNAL_STRENGTH";
    }
    
    // Constructors
    public SensorData() {}
    
    public SensorData(IoTDevice device, String sensorType, Double value, String unit) {
        this.device = device;
        this.sensorType = sensorType;
        this.value = value;
        this.unit = unit;
        this.timestamp = LocalDateTime.now();
        this.quality = DataQuality.GOOD;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public IoTDevice getDevice() { return device; }
    public void setDevice(IoTDevice device) { this.device = device; }
    
    public String getSensorType() { return sensorType; }
    public void setSensorType(String sensorType) { this.sensorType = sensorType; }
    
    public Double getValue() { return value; }
    public void setValue(Double value) { this.value = value; }
    
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    
    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    
    public DataQuality getQuality() { return quality; }
    public void setQuality(DataQuality quality) { this.quality = quality; }
} 