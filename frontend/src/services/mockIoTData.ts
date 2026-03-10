import { IoTDevice, SensorData, AIPrediction, Anomaly } from './iotService';

// Mock IoT Devices
export const mockDevices: IoTDevice[] = [
  {
    id: 1,
    deviceId: 'PS001',
    deviceName: 'Parking Sensor A1',
    deviceType: 'PARKING_SENSOR',
    location: 'Level 1, Section A',
    status: 'ONLINE',
    ipAddress: '192.168.1.101',
    lastSeen: new Date().toISOString()
  },
  {
    id: 2,
    deviceId: 'PS002',
    deviceName: 'Parking Sensor A2',
    deviceType: 'PARKING_SENSOR',
    location: 'Level 1, Section A',
    status: 'ONLINE',
    ipAddress: '192.168.1.102',
    lastSeen: new Date().toISOString()
  },
  {
    id: 3,
    deviceId: 'CAM001',
    deviceName: 'Security Camera 1',
    deviceType: 'CAMERA',
    location: 'Main Entrance',
    status: 'ONLINE',
    ipAddress: '192.168.1.201',
    lastSeen: new Date().toISOString()
  },
  {
    id: 4,
    deviceId: 'GC001',
    deviceName: 'Gate Controller',
    deviceType: 'GATE_CONTROLLER',
    location: 'Entry Gate',
    status: 'ONLINE',
    ipAddress: '192.168.1.150',
    lastSeen: new Date().toISOString()
  },
  {
    id: 5,
    deviceId: 'PT001',
    deviceName: 'Payment Terminal 1',
    deviceType: 'PAYMENT_TERMINAL',
    location: 'Exit Gate',
    status: 'MAINTENANCE',
    ipAddress: '192.168.1.160',
    lastSeen: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
  },
  {
    id: 6,
    deviceId: 'LS001',
    deviceName: 'Light Sensor 1',
    deviceType: 'LIGHT_SENSOR',
    location: 'Level 1, Section B',
    status: 'ONLINE',
    ipAddress: '192.168.1.170',
    lastSeen: new Date().toISOString()
  }
];

// Mock Sensor Data
export const mockSensorData: SensorData[] = [
  {
    id: 1,
    sensorType: 'OCCUPANCY',
    value: 1.0,
    unit: 'boolean',
    timestamp: new Date().toISOString(),
    quality: 'EXCELLENT'
  },
  {
    id: 2,
    sensorType: 'OCCUPANCY',
    value: 0.0,
    unit: 'boolean',
    timestamp: new Date().toISOString(),
    quality: 'EXCELLENT'
  },
  {
    id: 3,
    sensorType: 'TEMPERATURE',
    value: 22.5,
    unit: '°C',
    timestamp: new Date().toISOString(),
    quality: 'GOOD'
  },
  {
    id: 4,
    sensorType: 'POWER_CONSUMPTION',
    value: 45.2,
    unit: 'W',
    timestamp: new Date().toISOString(),
    quality: 'GOOD'
  },
  {
    id: 5,
    sensorType: 'LIGHT_LEVEL',
    value: 850,
    unit: 'lux',
    timestamp: new Date().toISOString(),
    quality: 'EXCELLENT'
  }
];

// Mock AI Predictions
export const mockAIPredictions: AIPrediction = {
  hourlyPredictions: [
    { hour: 8, predictedDemand: 15, confidence: 0.85 },
    { hour: 9, predictedDemand: 25, confidence: 0.88 },
    { hour: 10, predictedDemand: 30, confidence: 0.90 },
    { hour: 11, predictedDemand: 28, confidence: 0.87 },
    { hour: 12, predictedDemand: 35, confidence: 0.92 },
    { hour: 13, predictedDemand: 32, confidence: 0.89 },
    { hour: 14, predictedDemand: 28, confidence: 0.86 },
    { hour: 15, predictedDemand: 25, confidence: 0.84 },
    { hour: 16, predictedDemand: 30, confidence: 0.88 },
    { hour: 17, predictedDemand: 35, confidence: 0.91 },
    { hour: 18, predictedDemand: 40, confidence: 0.93 },
    { hour: 19, predictedDemand: 35, confidence: 0.90 },
    { hour: 20, predictedDemand: 25, confidence: 0.85 },
    { hour: 21, predictedDemand: 15, confidence: 0.82 }
  ],
  totalPredictedBookings: 380
};

// Mock Anomalies
export const mockAnomalies: Anomaly[] = [
  {
    sensorType: 'PAYMENT_PROCESSING',
    deviceId: 'PT001',
    value: 300,
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    severity: 'HIGH'
  },
  {
    sensorType: 'OCCUPANCY',
    deviceId: 'PS002',
    value: 15,
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    severity: 'MEDIUM'
  },
  {
    sensorType: 'CONNECTIVITY',
    deviceId: 'CAM001',
    value: 0,
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    severity: 'LOW'
  }
];

// Extended interfaces for richer mock data (not used in API calls)
export interface ExtendedIoTDevice extends IoTDevice {
  macAddress?: string;
  firmwareVersion?: string;
  createdAt?: string;
  updatedAt?: string;
  parkingSlot?: number | null;
}

export interface ExtendedSensorData extends SensorData {
  device?: IoTDevice;
  metadata?: string;
}

export interface ExtendedAIPrediction {
  demandPrediction: {
    hourlyDemand: Record<string, number>;
    confidence: number;
    nextHourPrediction: number;
  };
  slotOptimization: {
    recommendations: Array<{
      slotId: number;
      currentEfficiency: number;
      suggestedImprovements: string[];
      predictedEfficiency: number;
    }>;
    overallEfficiency: number;
  };
  maintenancePrediction: {
    devicesNeedingMaintenance: Array<{
      deviceId: string;
      deviceName: string;
      predictedIssue: string;
      confidence: number;
      estimatedDaysUntilIssue: number;
    }>;
    nextMaintenanceDate: string;
  };
  dynamicPricing: {
    currentRates: Record<string, number>;
    suggestedRates: Record<string, number>;
    revenueIncrease: number;
  };
  totalPredictedBookings?: number;
  hourlyPredictions?: Array<{
    hour: number;
    predictedDemand: number;
    confidence: number;
  }>;
}

export interface ExtendedAnomaly extends Anomaly {
  id?: number;
  deviceName?: string;
  anomalyType?: string;
  description?: string;
  status?: string;
  suggestedAction?: string;
}

// Extended mock data for dashboard display
export const extendedMockDevices: ExtendedIoTDevice[] = [
  {
    id: 1,
    deviceId: 'PS001',
    deviceName: 'Parking Sensor A1',
    deviceType: 'PARKING_SENSOR',
    location: 'Level 1, Section A',
    status: 'ONLINE',
    ipAddress: '192.168.1.101',
    lastSeen: new Date().toISOString(),
    macAddress: '00:11:22:33:44:55',
    firmwareVersion: 'v2.1.0',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: new Date().toISOString(),
    parkingSlot: 1
  },
  {
    id: 2,
    deviceId: 'PS002',
    deviceName: 'Parking Sensor A2',
    deviceType: 'PARKING_SENSOR',
    location: 'Level 1, Section A',
    status: 'ONLINE',
    ipAddress: '192.168.1.102',
    lastSeen: new Date().toISOString(),
    macAddress: '00:11:22:33:44:56',
    firmwareVersion: 'v2.1.0',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: new Date().toISOString(),
    parkingSlot: 2
  },
  {
    id: 3,
    deviceId: 'CAM001',
    deviceName: 'Security Camera 1',
    deviceType: 'CAMERA',
    location: 'Main Entrance',
    status: 'ONLINE',
    ipAddress: '192.168.1.201',
    lastSeen: new Date().toISOString(),
    macAddress: '00:11:22:33:44:57',
    firmwareVersion: 'v1.8.2',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: new Date().toISOString(),
    parkingSlot: null
  },
  {
    id: 4,
    deviceId: 'GC001',
    deviceName: 'Gate Controller',
    deviceType: 'GATE_CONTROLLER',
    location: 'Entry Gate',
    status: 'ONLINE',
    ipAddress: '192.168.1.150',
    lastSeen: new Date().toISOString(),
    macAddress: '00:11:22:33:44:58',
    firmwareVersion: 'v3.0.1',
    createdAt: '2024-01-12T14:00:00Z',
    updatedAt: new Date().toISOString(),
    parkingSlot: null
  },
  {
    id: 5,
    deviceId: 'PT001',
    deviceName: 'Payment Terminal 1',
    deviceType: 'PAYMENT_TERMINAL',
    location: 'Exit Gate',
    status: 'MAINTENANCE',
    ipAddress: '192.168.1.160',
    lastSeen: new Date(Date.now() - 3600000).toISOString(),
    macAddress: '00:11:22:33:44:59',
    firmwareVersion: 'v2.5.0',
    createdAt: '2024-01-08T11:00:00Z',
    updatedAt: new Date().toISOString(),
    parkingSlot: null
  },
  {
    id: 6,
    deviceId: 'LS001',
    deviceName: 'Light Sensor 1',
    deviceType: 'LIGHT_SENSOR',
    location: 'Level 1, Section B',
    status: 'ONLINE',
    ipAddress: '192.168.1.170',
    lastSeen: new Date().toISOString(),
    macAddress: '00:11:22:33:44:60',
    firmwareVersion: 'v1.2.0',
    createdAt: '2024-01-20T16:00:00Z',
    updatedAt: new Date().toISOString(),
    parkingSlot: null
  }
];

export const extendedMockAIPredictions: ExtendedAIPrediction = {
  demandPrediction: {
    hourlyDemand: {
      '08:00': 15,
      '09:00': 25,
      '10:00': 30,
      '11:00': 28,
      '12:00': 35,
      '13:00': 32,
      '14:00': 28,
      '15:00': 25,
      '16:00': 30,
      '17:00': 35,
      '18:00': 40,
      '19:00': 35,
      '20:00': 25,
      '21:00': 15
    },
    confidence: 0.85,
    nextHourPrediction: 28
  },
  totalPredictedBookings: 380,
  hourlyPredictions: [
    { hour: 8, predictedDemand: 15, confidence: 0.85 },
    { hour: 9, predictedDemand: 25, confidence: 0.88 },
    { hour: 10, predictedDemand: 30, confidence: 0.90 },
    { hour: 11, predictedDemand: 28, confidence: 0.87 },
    { hour: 12, predictedDemand: 35, confidence: 0.92 },
    { hour: 13, predictedDemand: 32, confidence: 0.89 },
    { hour: 14, predictedDemand: 28, confidence: 0.86 },
    { hour: 15, predictedDemand: 25, confidence: 0.84 },
    { hour: 16, predictedDemand: 30, confidence: 0.88 },
    { hour: 17, predictedDemand: 35, confidence: 0.91 },
    { hour: 18, predictedDemand: 40, confidence: 0.93 },
    { hour: 19, predictedDemand: 35, confidence: 0.90 },
    { hour: 20, predictedDemand: 25, confidence: 0.85 },
    { hour: 21, predictedDemand: 15, confidence: 0.82 }
  ],
  slotOptimization: {
    recommendations: [
      {
        slotId: 1,
        currentEfficiency: 0.75,
        suggestedImprovements: ['Extend operating hours', 'Add signage'],
        predictedEfficiency: 0.88
      },
      {
        slotId: 2,
        currentEfficiency: 0.82,
        suggestedImprovements: ['Optimize pricing'],
        predictedEfficiency: 0.90
      }
    ],
    overallEfficiency: 0.78
  },
  maintenancePrediction: {
    devicesNeedingMaintenance: [
      {
        deviceId: 'PT001',
        deviceName: 'Payment Terminal 1',
        predictedIssue: 'Card reader malfunction',
        confidence: 0.92,
        estimatedDaysUntilIssue: 3
      }
    ],
    nextMaintenanceDate: '2024-02-15'
  },
  dynamicPricing: {
    currentRates: {
      '08:00-12:00': 2.50,
      '12:00-18:00': 3.00,
      '18:00-22:00': 2.75,
      '22:00-08:00': 1.50
    },
    suggestedRates: {
      '08:00-12:00': 2.75,
      '12:00-18:00': 3.25,
      '18:00-22:00': 3.00,
      '22:00-08:00': 1.50
    },
    revenueIncrease: 0.12
  }
};

export const extendedMockAnomalies: ExtendedAnomaly[] = [
  {
    id: 1,
    sensorType: 'PAYMENT_PROCESSING',
    deviceId: 'PT001',
    deviceName: 'Payment Terminal 1',
    anomalyType: 'PERFORMANCE_DEGRADATION',
    value: 300,
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    severity: 'HIGH',
    description: 'Payment processing time increased by 300%',
    status: 'ACTIVE',
    suggestedAction: 'Restart payment terminal and check network connectivity'
  },
  {
    id: 2,
    sensorType: 'OCCUPANCY',
    deviceId: 'PS002',
    deviceName: 'Parking Sensor A2',
    anomalyType: 'SENSOR_DRIFT',
    value: 15,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    severity: 'MEDIUM',
    description: 'Sensor readings showing 15% deviation from baseline',
    status: 'RESOLVED',
    suggestedAction: 'Calibrate sensor and monitor for 24 hours'
  },
  {
    id: 3,
    sensorType: 'CONNECTIVITY',
    deviceId: 'CAM001',
    deviceName: 'Security Camera 1',
    anomalyType: 'CONNECTIVITY_ISSUE',
    value: 0,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    severity: 'LOW',
    description: 'Intermittent connection drops detected',
    status: 'ACTIVE',
    suggestedAction: 'Check network cable and router settings'
  }
];

// Mock service functions
export const mockIoTService = {
  getAllDevices: async (): Promise<IoTDevice[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockDevices;
  },

  getRecentSensorData: async (hours: number): Promise<SensorData[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockSensorData;
  },

  getDemandPrediction: async (): Promise<AIPrediction> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockAIPredictions;
  },

  detectAnomalies: async (): Promise<Anomaly[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockAnomalies;
  },

  getSystemHealth: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      overallHealth: 'GOOD',
      onlineDevices: 5,
      totalDevices: 6,
      uptime: '99.2%',
      lastMaintenance: '2024-01-25T10:00:00Z'
    };
  },

  registerDevice: async (deviceData: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newDevice: IoTDevice = {
      id: mockDevices.length + 1,
      deviceId: deviceData.deviceId,
      deviceName: deviceData.deviceName,
      deviceType: deviceData.deviceType,
      location: deviceData.location,
      status: 'ONLINE',
      ipAddress: deviceData.ipAddress,
      lastSeen: new Date().toISOString()
    };
    mockDevices.push(newDevice);
    return newDevice;
  }
}; 