import api from './authService';

export interface IoTDevice {
  id: number;
  deviceId: string;
  deviceName: string;
  deviceType: string;
  location: string;
  status: string;
  ipAddress: string;
  lastSeen: string;
}

export interface SensorData {
  id: number;
  sensorType: string;
  value: number;
  unit: string;
  timestamp: string;
  quality: string;
}

export interface AIPrediction {
  hourlyPredictions: Array<{
    hour: number;
    predictedDemand: number;
    confidence: number;
  }>;
  totalPredictedBookings: number;
}

export interface Anomaly {
  sensorType: string;
  deviceId: string;
  value: number;
  timestamp: string;
  severity: string;
}

export const iotService = {
  // Device Management
  async getAllDevices(): Promise<IoTDevice[]> {
    const response = await api.get<IoTDevice[]>('/iot/devices');
    return response.data;
  },

  async getDeviceById(deviceId: string): Promise<IoTDevice> {
    const response = await api.get<IoTDevice>(`/iot/devices/${deviceId}`);
    return response.data;
  },

  async registerDevice(device: Partial<IoTDevice>): Promise<IoTDevice> {
    const response = await api.post<IoTDevice>('/iot/devices', device);
    return response.data;
  },

  async updateDevice(deviceId: string, device: Partial<IoTDevice>): Promise<IoTDevice> {
    const response = await api.put<IoTDevice>(`/iot/devices/${deviceId}`, device);
    return response.data;
  },

  async deleteDevice(deviceId: string): Promise<void> {
    await api.delete(`/iot/devices/${deviceId}`);
  },

  // Sensor Data
  async getRecentSensorData(hours: number = 24): Promise<SensorData[]> {
    const response = await api.get<SensorData[]>(`/iot/data/recent?hours=${hours}`);
    return response.data;
  },

  async getDeviceData(deviceId: string, hours: number = 24): Promise<SensorData[]> {
    const response = await api.get<SensorData[]>(`/iot/data/${deviceId}?hours=${hours}`);
    return response.data;
  },

  async sendSensorData(sensorData: any): Promise<SensorData> {
    const response = await api.post<SensorData>('/iot/data', sensorData);
    return response.data;
  },

  // Device Health
  async getDeviceHealth(deviceId: string): Promise<any> {
    const response = await api.get(`/iot/devices/${deviceId}/health`);
    return response.data;
  },

  async getSystemHealth(): Promise<any> {
    const response = await api.get('/iot/devices/health/overview');
    return response.data;
  },

  // AI Analytics
  async getDemandPrediction(): Promise<AIPrediction> {
    const response = await api.get<AIPrediction>('/iot/analytics/demand-prediction');
    return response.data;
  },

  async detectAnomalies(): Promise<Anomaly[]> {
    const response = await api.get<Anomaly[]>('/iot/analytics/anomalies');
    return response.data;
  },

  async getSlotOptimization(): Promise<any> {
    const response = await api.get('/iot/analytics/optimization');
    return response.data;
  },

  async getMaintenancePredictions(): Promise<any[]> {
    const response = await api.get<any[]>('/iot/analytics/maintenance');
    return response.data;
  },

  async getDynamicPricing(): Promise<any> {
    const response = await api.get('/iot/analytics/pricing');
    return response.data;
  },

  // Device Control
  async sendDeviceCommand(deviceId: string, command: any): Promise<any> {
    const response = await api.post(`/iot/devices/${deviceId}/control`, command);
    return response.data;
  },

  async restartDevice(deviceId: string): Promise<any> {
    const response = await api.post(`/iot/devices/${deviceId}/restart`);
    return response.data;
  },

  async calibrateDevice(deviceId: string): Promise<any> {
    const response = await api.post(`/iot/devices/${deviceId}/calibrate`);
    return response.data;
  },

  // Alerts
  async getActiveAlerts(): Promise<any[]> {
    const response = await api.get<any[]>('/iot/alerts');
    return response.data;
  },

  async acknowledgeAlert(alertId: number): Promise<any> {
    const response = await api.post(`/iot/alerts/${alertId}/acknowledge`);
    return response.data;
  },

  // Firmware Management
  async getFirmwareInfo(deviceId: string): Promise<any> {
    const response = await api.get(`/iot/devices/${deviceId}/firmware`);
    return response.data;
  },

  async updateFirmware(deviceId: string, firmwareUpdate: any): Promise<any> {
    const response = await api.post(`/iot/devices/${deviceId}/firmware/update`, firmwareUpdate);
    return response.data;
  },

  // Network Management
  async getNetworkStatus(): Promise<any> {
    const response = await api.get('/iot/network/status');
    return response.data;
  },

  async getNetworkDevices(): Promise<any[]> {
    const response = await api.get<any[]>('/iot/network/devices');
    return response.data;
  },

  // Data Export
  async exportData(deviceId: string, startDate: string, endDate: string, format: string = 'json'): Promise<any> {
    const response = await api.get(`/iot/data/export?deviceId=${deviceId}&startDate=${startDate}&endDate=${endDate}&format=${format}`);
    return response.data;
  }
}; 