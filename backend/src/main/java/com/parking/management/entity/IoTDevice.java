package com.parking.management.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "iot_devices")
public class IoTDevice {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String deviceId;
    
    @Column(nullable = false)
    private String deviceName;
    
    @Enumerated(EnumType.STRING)
    private DeviceType deviceType;
    
    @Column(nullable = false)
    private String location;
    
    @ManyToOne
    @JoinColumn(name = "parking_slot_id")
    private ParkingSlot parkingSlot;
    
    @Enumerated(EnumType.STRING)
    private DeviceStatus status;
    
    private String ipAddress;
    private String macAddress;
    private String firmwareVersion;
    private LocalDateTime lastSeen;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // IoT Device Types
    public enum DeviceType {
        PARKING_SENSOR,      // Ground sensors to detect vehicle presence
        CAMERA,              // Surveillance cameras
        LIGHT_SENSOR,        // Ambient light sensors
        WEATHER_SENSOR,      // Weather monitoring
        GATE_CONTROLLER,     // Entry/exit gate controllers
        PAYMENT_TERMINAL,    // Payment kiosks
        AIR_QUALITY_SENSOR,  // Environmental monitoring
        ENERGY_METER         // Power consumption monitoring
    }
    
    // Device Status
    public enum DeviceStatus {
        ONLINE,             // Device is connected and working
        OFFLINE,            // Device is disconnected
        MAINTENANCE,        // Device under maintenance
        ERROR,              // Device has errors
        CALIBRATING         // Device is calibrating
    }
    
    // Constructors
    public IoTDevice() {}
    
    public IoTDevice(String deviceId, String deviceName, DeviceType deviceType, String location) {
        this.deviceId = deviceId;
        this.deviceName = deviceName;
        this.deviceType = deviceType;
        this.location = location;
        this.status = DeviceStatus.OFFLINE;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }
    
    public String getDeviceName() { return deviceName; }
    public void setDeviceName(String deviceName) { this.deviceName = deviceName; }
    
    public DeviceType getDeviceType() { return deviceType; }
    public void setDeviceType(DeviceType deviceType) { this.deviceType = deviceType; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public ParkingSlot getParkingSlot() { return parkingSlot; }
    public void setParkingSlot(ParkingSlot parkingSlot) { this.parkingSlot = parkingSlot; }
    
    public DeviceStatus getStatus() { return status; }
    public void setStatus(DeviceStatus status) { this.status = status; }
    
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    
    public String getMacAddress() { return macAddress; }
    public void setMacAddress(String macAddress) { this.macAddress = macAddress; }
    
    public String getFirmwareVersion() { return firmwareVersion; }
    public void setFirmwareVersion(String firmwareVersion) { this.firmwareVersion = firmwareVersion; }
    
    public LocalDateTime getLastSeen() { return lastSeen; }
    public void setLastSeen(LocalDateTime lastSeen) { this.lastSeen = lastSeen; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
} 