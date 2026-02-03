package com.parking.management.repository;

import com.parking.management.entity.SensorData;
import com.parking.management.entity.IoTDevice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SensorDataRepository extends JpaRepository<SensorData, Long> {
    List<SensorData> findByDevice(IoTDevice device);
    List<SensorData> findByDeviceAndTimestampAfterOrderByTimestampDesc(IoTDevice device, LocalDateTime timestamp);
    List<SensorData> findByTimestampAfterOrderByTimestampDesc(LocalDateTime timestamp);
    List<SensorData> findBySensorType(String sensorType);
    List<SensorData> findByDeviceAndSensorType(IoTDevice device, String sensorType);
    
    @Query("SELECT s FROM SensorData s WHERE s.device = :device AND s.timestamp BETWEEN :startTime AND :endTime")
    List<SensorData> findByDeviceAndTimeRange(@Param("device") IoTDevice device, 
                                             @Param("startTime") LocalDateTime startTime, 
                                             @Param("endTime") LocalDateTime endTime);
    
    @Query("SELECT s FROM SensorData s WHERE s.sensorType = :sensorType AND s.timestamp BETWEEN :startTime AND :endTime")
    List<SensorData> findBySensorTypeAndTimeRange(@Param("sensorType") String sensorType, 
                                                 @Param("startTime") LocalDateTime startTime, 
                                                 @Param("endTime") LocalDateTime endTime);
} 