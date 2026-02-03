package com.parking.management.controller;

import com.parking.management.entity.IoTDevice;
import com.parking.management.entity.SensorData;
import com.parking.management.service.IoTService;
import com.parking.management.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/iot")
public class IoTController {
    
    @Autowired
    private IoTService ioTService;
    
    @Autowired
    private AIService aiService;
    
    // Device Management
    @GetMapping("/devices")
    public ResponseEntity<List<IoTDevice>> getAllDevices() {
        return ResponseEntity.ok(ioTService.getAllDevices());
    }
    
    @GetMapping("/devices/{deviceId}")
    public ResponseEntity<IoTDevice> getDeviceById(@PathVariable String deviceId) {
        return ResponseEntity.ok(ioTService.getDeviceById(deviceId));
    }
    
    @PostMapping("/devices")
    public ResponseEntity<IoTDevice> registerDevice(@RequestBody IoTDevice device) {
        return ResponseEntity.ok(ioTService.registerDevice(device));
    }
    
    @PutMapping("/devices/{deviceId}")
    public ResponseEntity<IoTDevice> updateDevice(@PathVariable String deviceId, @RequestBody IoTDevice device) {
        return ResponseEntity.ok(ioTService.updateDevice(deviceId, device));
    }
    
    @DeleteMapping("/devices/{deviceId}")
    public ResponseEntity<Void> deleteDevice(@PathVariable String deviceId) {
        ioTService.deleteDevice(deviceId);
        return ResponseEntity.ok().build();
    }
    
    // Real-time Data Collection
    @PostMapping("/data")
    public ResponseEntity<SensorData> receiveSensorData(@RequestBody Map<String, Object> sensorData) {
        return ResponseEntity.ok(ioTService.processSensorData(sensorData));
    }
    
    @GetMapping("/data/{deviceId}")
    public ResponseEntity<List<SensorData>> getDeviceData(
        @PathVariable String deviceId,
        @RequestParam(defaultValue = "24") int hours
    ) {
        return ResponseEntity.ok(ioTService.getDeviceData(deviceId, hours));
    }
    
    @GetMapping("/data/recent")
    public ResponseEntity<List<SensorData>> getRecentData(@RequestParam(defaultValue = "24") int hours) {
        return ResponseEntity.ok(ioTService.getRecentSensorData(hours));
    }
    
    // Device Health Monitoring
    @GetMapping("/devices/{deviceId}/health")
    public ResponseEntity<Map<String, Object>> getDeviceHealth(@PathVariable String deviceId) {
        return ResponseEntity.ok(ioTService.getDeviceHealth(deviceId));
    }
    
    @GetMapping("/devices/health/overview")
    public ResponseEntity<Map<String, Object>> getSystemHealth() {
        return ResponseEntity.ok(ioTService.getSystemHealth());
    }
    
    // AI-Powered Analytics
    @GetMapping("/analytics/demand-prediction")
    public ResponseEntity<Map<String, Object>> getDemandPrediction() {
        return ResponseEntity.ok(aiService.predictParkingDemand());
    }
    
    @GetMapping("/analytics/anomalies")
    public ResponseEntity<List<Map<String, Object>>> detectAnomalies() {
        return ResponseEntity.ok(aiService.detectAnomalies());
    }
    
    @GetMapping("/analytics/optimization")
    public ResponseEntity<Map<String, Object>> getSlotOptimization() {
        return ResponseEntity.ok(aiService.optimizeSlotAllocation());
    }
    
    @GetMapping("/analytics/maintenance")
    public ResponseEntity<List<Map<String, Object>>> getMaintenancePredictions() {
        return ResponseEntity.ok(aiService.predictMaintenanceNeeds());
    }
    
    @GetMapping("/analytics/pricing")
    public ResponseEntity<Map<String, Object>> getDynamicPricing() {
        return ResponseEntity.ok(aiService.generateDynamicPricing());
    }
    
    // Device Control
    @PostMapping("/devices/{deviceId}/control")
    public ResponseEntity<Map<String, Object>> controlDevice(
        @PathVariable String deviceId,
        @RequestBody Map<String, Object> command
    ) {
        return ResponseEntity.ok(ioTService.sendDeviceCommand(deviceId, command));
    }
    
    @PostMapping("/devices/{deviceId}/restart")
    public ResponseEntity<Map<String, Object>> restartDevice(@PathVariable String deviceId) {
        return ResponseEntity.ok(ioTService.restartDevice(deviceId));
    }
    
    @PostMapping("/devices/{deviceId}/calibrate")
    public ResponseEntity<Map<String, Object>> calibrateDevice(@PathVariable String deviceId) {
        return ResponseEntity.ok(ioTService.calibrateDevice(deviceId));
    }
    
    // Bulk Operations
    @PostMapping("/devices/bulk/update")
    public ResponseEntity<List<IoTDevice>> bulkUpdateDevices(@RequestBody List<IoTDevice> devices) {
        return ResponseEntity.ok(ioTService.bulkUpdateDevices(devices));
    }
    
    @PostMapping("/devices/bulk/restart")
    public ResponseEntity<Map<String, Object>> bulkRestartDevices(@RequestBody List<String> deviceIds) {
        return ResponseEntity.ok(ioTService.bulkRestartDevices(deviceIds));
    }
    
    // Alerts and Notifications
    @GetMapping("/alerts")
    public ResponseEntity<List<Map<String, Object>>> getActiveAlerts() {
        return ResponseEntity.ok(ioTService.getActiveAlerts());
    }
    
    @PostMapping("/alerts/{alertId}/acknowledge")
    public ResponseEntity<Map<String, Object>> acknowledgeAlert(@PathVariable Long alertId) {
        return ResponseEntity.ok(ioTService.acknowledgeAlert(alertId));
    }
    
    // Device Firmware Management
    @GetMapping("/devices/{deviceId}/firmware")
    public ResponseEntity<Map<String, Object>> getFirmwareInfo(@PathVariable String deviceId) {
        return ResponseEntity.ok(ioTService.getFirmwareInfo(deviceId));
    }
    
    @PostMapping("/devices/{deviceId}/firmware/update")
    public ResponseEntity<Map<String, Object>> updateFirmware(
        @PathVariable String deviceId,
        @RequestBody Map<String, Object> firmwareUpdate
    ) {
        return ResponseEntity.ok(ioTService.updateFirmware(deviceId, firmwareUpdate));
    }
    
    // Network Management
    @GetMapping("/network/status")
    public ResponseEntity<Map<String, Object>> getNetworkStatus() {
        return ResponseEntity.ok(ioTService.getNetworkStatus());
    }
    
    @GetMapping("/network/devices")
    public ResponseEntity<List<Map<String, Object>>> getNetworkDevices() {
        return ResponseEntity.ok(ioTService.getNetworkDevices());
    }
    
    // Data Export
    @GetMapping("/data/export")
    public ResponseEntity<Map<String, Object>> exportData(
        @RequestParam String deviceId,
        @RequestParam String startDate,
        @RequestParam String endDate,
        @RequestParam(defaultValue = "json") String format
    ) {
        return ResponseEntity.ok(ioTService.exportData(deviceId, startDate, endDate, format));
    }
} 