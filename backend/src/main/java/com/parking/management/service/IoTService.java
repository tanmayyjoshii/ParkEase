package com.parking.management.service;

import com.parking.management.entity.IoTDevice;
import com.parking.management.entity.SensorData;
import com.parking.management.repository.IoTDeviceRepository;
import com.parking.management.repository.SensorDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class IoTService {
    
    @Autowired
    private IoTDeviceRepository ioTDeviceRepository;
    
    @Autowired
    private SensorDataRepository sensorDataRepository;
    
    // Device Management
    public List<IoTDevice> getAllDevices() {
        return ioTDeviceRepository.findAll();
    }
    
    public IoTDevice getDeviceById(String deviceId) {
        return ioTDeviceRepository.findByDeviceId(deviceId)
            .orElseThrow(() -> new RuntimeException("Device not found: " + deviceId));
    }
    
    public IoTDevice registerDevice(IoTDevice device) {
        device.setCreatedAt(LocalDateTime.now());
        device.setUpdatedAt(LocalDateTime.now());
        return ioTDeviceRepository.save(device);
    }
    
    public IoTDevice updateDevice(String deviceId, IoTDevice device) {
        IoTDevice existingDevice = getDeviceById(deviceId);
        existingDevice.setDeviceName(device.getDeviceName());
        existingDevice.setLocation(device.getLocation());
        existingDevice.setStatus(device.getStatus());
        existingDevice.setIpAddress(device.getIpAddress());
        existingDevice.setMacAddress(device.getMacAddress());
        existingDevice.setFirmwareVersion(device.getFirmwareVersion());
        existingDevice.setUpdatedAt(LocalDateTime.now());
        return ioTDeviceRepository.save(existingDevice);
    }
    
    public void deleteDevice(String deviceId) {
        IoTDevice device = getDeviceById(deviceId);
        ioTDeviceRepository.delete(device);
    }
    
    // Sensor Data Processing
    public SensorData processSensorData(Map<String, Object> sensorDataMap) {
        String deviceId = (String) sensorDataMap.get("deviceId");
        String sensorType = (String) sensorDataMap.get("sensorType");
        Double value = ((Number) sensorDataMap.get("value")).doubleValue();
        String unit = (String) sensorDataMap.get("unit");
        
        IoTDevice device = getDeviceById(deviceId);
        
        SensorData sensorData = new SensorData(device, sensorType, value, unit);
        sensorData.setMetadata(convertMapToJson(sensorDataMap));
        
        // Update device last seen
        device.setLastSeen(LocalDateTime.now());
        device.setStatus(IoTDevice.DeviceStatus.ONLINE);
        ioTDeviceRepository.save(device);
        
        return sensorDataRepository.save(sensorData);
    }
    
    public List<SensorData> getDeviceData(String deviceId, int hours) {
        IoTDevice device = getDeviceById(deviceId);
        LocalDateTime cutoff = LocalDateTime.now().minusHours(hours);
        return sensorDataRepository.findByDeviceAndTimestampAfterOrderByTimestampDesc(device, cutoff);
    }
    
    public List<SensorData> getRecentSensorData(int hours) {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(hours);
        return sensorDataRepository.findByTimestampAfterOrderByTimestampDesc(cutoff);
    }
    
    // Device Health Monitoring
    public Map<String, Object> getDeviceHealth(String deviceId) {
        IoTDevice device = getDeviceById(deviceId);
        List<SensorData> recentData = getDeviceData(deviceId, 24);
        
        Map<String, Object> health = new HashMap<>();
        health.put("deviceId", deviceId);
        health.put("status", device.getStatus());
        health.put("lastSeen", device.getLastSeen());
        health.put("totalReadings", recentData.size());
        
        // Calculate health metrics
        if (!recentData.isEmpty()) {
            double avgQuality = recentData.stream()
                .mapToDouble(data -> getQualityScore(data.getQuality()))
                .average()
                .orElse(0.0);
            
            health.put("dataQuality", avgQuality);
            health.put("healthScore", calculateHealthScore(device, recentData));
        }
        
        return health;
    }
    
    public Map<String, Object> getSystemHealth() {
        List<IoTDevice> devices = getAllDevices();
        List<SensorData> recentData = getRecentSensorData(24);
        
        Map<String, Object> systemHealth = new HashMap<>();
        systemHealth.put("totalDevices", devices.size());
        systemHealth.put("onlineDevices", devices.stream()
            .filter(d -> d.getStatus() == IoTDevice.DeviceStatus.ONLINE)
            .count());
        systemHealth.put("totalReadings", recentData.size());
        systemHealth.put("systemStatus", calculateSystemStatus(devices));
        
        return systemHealth;
    }
    
    // Device Control
    public Map<String, Object> sendDeviceCommand(String deviceId, Map<String, Object> command) {
        IoTDevice device = getDeviceById(deviceId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("deviceId", deviceId);
        response.put("command", command);
        response.put("status", "sent");
        response.put("timestamp", LocalDateTime.now());
        
        // In a real implementation, you would send the command to the actual device
        // For now, we'll just update the device status
        device.setStatus(IoTDevice.DeviceStatus.ONLINE);
        device.setLastSeen(LocalDateTime.now());
        ioTDeviceRepository.save(device);
        
        return response;
    }
    
    public Map<String, Object> restartDevice(String deviceId) {
        IoTDevice device = getDeviceById(deviceId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("deviceId", deviceId);
        response.put("action", "restart");
        response.put("status", "initiated");
        response.put("timestamp", LocalDateTime.now());
        
        // Simulate restart process
        device.setStatus(IoTDevice.DeviceStatus.MAINTENANCE);
        ioTDeviceRepository.save(device);
        
        // In a real implementation, you would send restart command to device
        // and monitor for it to come back online
        
        return response;
    }
    
    public Map<String, Object> calibrateDevice(String deviceId) {
        IoTDevice device = getDeviceById(deviceId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("deviceId", deviceId);
        response.put("action", "calibrate");
        response.put("status", "calibrating");
        response.put("timestamp", LocalDateTime.now());
        
        device.setStatus(IoTDevice.DeviceStatus.CALIBRATING);
        ioTDeviceRepository.save(device);
        
        return response;
    }
    
    // Bulk Operations
    public List<IoTDevice> bulkUpdateDevices(List<IoTDevice> devices) {
        return devices.stream()
            .map(device -> {
                device.setUpdatedAt(LocalDateTime.now());
                return ioTDeviceRepository.save(device);
            })
            .collect(Collectors.toList());
    }
    
    public Map<String, Object> bulkRestartDevices(List<String> deviceIds) {
        Map<String, Object> response = new HashMap<>();
        response.put("action", "bulk_restart");
        response.put("devices", deviceIds);
        response.put("status", "initiated");
        response.put("timestamp", LocalDateTime.now());
        
        deviceIds.forEach(this::restartDevice);
        
        return response;
    }
    
    // Alerts and Notifications
    public List<Map<String, Object>> getActiveAlerts() {
        List<Map<String, Object>> alerts = new ArrayList<>();
        
        // Check for offline devices
        List<IoTDevice> offlineDevices = ioTDeviceRepository.findByStatus(IoTDevice.DeviceStatus.OFFLINE);
        for (IoTDevice device : offlineDevices) {
            Map<String, Object> alert = new HashMap<>();
            alert.put("id", System.currentTimeMillis());
            alert.put("type", "DEVICE_OFFLINE");
            alert.put("deviceId", device.getDeviceId());
            alert.put("deviceName", device.getDeviceName());
            alert.put("severity", "HIGH");
            alert.put("message", "Device " + device.getDeviceName() + " is offline");
            alert.put("timestamp", LocalDateTime.now());
            alerts.add(alert);
        }
        
        // Check for devices with errors
        List<IoTDevice> errorDevices = ioTDeviceRepository.findByStatus(IoTDevice.DeviceStatus.ERROR);
        for (IoTDevice device : errorDevices) {
            Map<String, Object> alert = new HashMap<>();
            alert.put("id", System.currentTimeMillis());
            alert.put("type", "DEVICE_ERROR");
            alert.put("deviceId", device.getDeviceId());
            alert.put("deviceName", device.getDeviceName());
            alert.put("severity", "CRITICAL");
            alert.put("message", "Device " + device.getDeviceName() + " has errors");
            alert.put("timestamp", LocalDateTime.now());
            alerts.add(alert);
        }
        
        return alerts;
    }
    
    public Map<String, Object> acknowledgeAlert(Long alertId) {
        Map<String, Object> response = new HashMap<>();
        response.put("alertId", alertId);
        response.put("status", "acknowledged");
        response.put("timestamp", LocalDateTime.now());
        
        // In a real implementation, you would update the alert status in database
        
        return response;
    }
    
    // Firmware Management
    public Map<String, Object> getFirmwareInfo(String deviceId) {
        IoTDevice device = getDeviceById(deviceId);
        
        Map<String, Object> firmwareInfo = new HashMap<>();
        firmwareInfo.put("deviceId", deviceId);
        firmwareInfo.put("currentVersion", device.getFirmwareVersion());
        firmwareInfo.put("lastUpdate", device.getUpdatedAt());
        firmwareInfo.put("updateAvailable", false); // Mock data
        
        return firmwareInfo;
    }
    
    public Map<String, Object> updateFirmware(String deviceId, Map<String, Object> firmwareUpdate) {
        IoTDevice device = getDeviceById(deviceId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("deviceId", deviceId);
        response.put("action", "firmware_update");
        response.put("status", "initiated");
        response.put("timestamp", LocalDateTime.now());
        
        // In a real implementation, you would initiate firmware update process
        
        return response;
    }
    
    // Network Management
    public Map<String, Object> getNetworkStatus() {
        Map<String, Object> networkStatus = new HashMap<>();
        networkStatus.put("totalDevices", getAllDevices().size());
        networkStatus.put("onlineDevices", getAllDevices().stream()
            .filter(d -> d.getStatus() == IoTDevice.DeviceStatus.ONLINE)
            .count());
        networkStatus.put("networkHealth", "GOOD");
        networkStatus.put("lastCheck", LocalDateTime.now());
        
        return networkStatus;
    }
    
    public List<Map<String, Object>> getNetworkDevices() {
        return getAllDevices().stream()
            .map(device -> {
                Map<String, Object> deviceInfo = new HashMap<>();
                deviceInfo.put("deviceId", device.getDeviceId());
                deviceInfo.put("deviceName", device.getDeviceName());
                deviceInfo.put("status", device.getStatus());
                deviceInfo.put("ipAddress", device.getIpAddress());
                deviceInfo.put("lastSeen", device.getLastSeen());
                return deviceInfo;
            })
            .collect(Collectors.toList());
    }
    
    // Data Export
    public Map<String, Object> exportData(String deviceId, String startDate, String endDate, String format) {
        Map<String, Object> export = new HashMap<>();
        export.put("deviceId", deviceId);
        export.put("startDate", startDate);
        export.put("endDate", endDate);
        export.put("format", format);
        export.put("status", "completed");
        export.put("timestamp", LocalDateTime.now());
        
        // In a real implementation, you would generate and return the actual data file
        
        return export;
    }
    
    // Helper methods
    private String convertMapToJson(Map<String, Object> map) {
        // Simple JSON conversion - in production, use a proper JSON library
        return map.toString();
    }
    
    private double getQualityScore(SensorData.DataQuality quality) {
        switch (quality) {
            case EXCELLENT: return 1.0;
            case GOOD: return 0.8;
            case FAIR: return 0.6;
            case POOR: return 0.3;
            case ERROR: return 0.0;
            default: return 0.5;
        }
    }
    
    private double calculateHealthScore(IoTDevice device, List<SensorData> recentData) {
        double statusScore = device.getStatus() == IoTDevice.DeviceStatus.ONLINE ? 1.0 : 0.0;
        double dataScore = recentData.isEmpty() ? 0.0 : 0.8;
        double recencyScore = device.getLastSeen().isAfter(LocalDateTime.now().minusMinutes(5)) ? 1.0 : 0.5;
        
        return (statusScore + dataScore + recencyScore) / 3.0;
    }
    
    private String calculateSystemStatus(List<IoTDevice> devices) {
        long onlineCount = devices.stream()
            .filter(d -> d.getStatus() == IoTDevice.DeviceStatus.ONLINE)
            .count();
        
        double onlinePercentage = (double) onlineCount / devices.size();
        
        if (onlinePercentage >= 0.9) return "EXCELLENT";
        else if (onlinePercentage >= 0.7) return "GOOD";
        else if (onlinePercentage >= 0.5) return "FAIR";
        else return "POOR";
    }
} 