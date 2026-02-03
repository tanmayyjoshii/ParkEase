package com.parking.management.service;

import com.parking.management.entity.SensorData;
import com.parking.management.repository.SensorDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SensorDataService {
    
    @Autowired
    private SensorDataRepository sensorDataRepository;
    
    public List<SensorData> getRecentSensorData(int hours) {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(hours);
        return sensorDataRepository.findByTimestampAfterOrderByTimestampDesc(cutoff);
    }
    
    public List<SensorData> getSensorDataByType(String sensorType) {
        return sensorDataRepository.findBySensorType(sensorType);
    }
    
    public List<SensorData> getSensorDataByTimeRange(String sensorType, LocalDateTime startTime, LocalDateTime endTime) {
        return sensorDataRepository.findBySensorTypeAndTimeRange(sensorType, startTime, endTime);
    }
} 