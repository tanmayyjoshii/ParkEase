package com.parking.management.repository;

import com.parking.management.entity.IoTDevice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface IoTDeviceRepository extends JpaRepository<IoTDevice, Long> {
    Optional<IoTDevice> findByDeviceId(String deviceId);
    List<IoTDevice> findByStatus(IoTDevice.DeviceStatus status);
    List<IoTDevice> findByDeviceType(IoTDevice.DeviceType deviceType);
    List<IoTDevice> findByLocation(String location);
} 