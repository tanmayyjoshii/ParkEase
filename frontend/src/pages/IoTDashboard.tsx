import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wifi, 
  Cpu, 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Zap,
  Eye,
  Shield,
  Database,
  Network,
  Plus,
  RefreshCw,
  CheckCircle
} from 'lucide-react';
import Navigation from '../components/Navigation';
import { SensorData } from '../services/iotService';
import { 
  mockIoTService, 
  extendedMockDevices, 
  extendedMockAIPredictions, 
  extendedMockAnomalies,
  ExtendedIoTDevice,
  ExtendedAIPrediction,
  ExtendedAnomaly
} from '../services/mockIoTData';
import ApiTest from '../components/ApiTest';



const IoTDashboard: React.FC = () => {
  const [devices, setDevices] = useState<ExtendedIoTDevice[]>([]);
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [aiPredictions, setAiPredictions] = useState<ExtendedAIPrediction | null>(null);
  const [anomalies, setAnomalies] = useState<ExtendedAnomaly[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [showDeviceDetails, setShowDeviceDetails] = useState(false);
  const [showDeviceControl, setShowDeviceControl] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchIoTData();
    const interval = setInterval(fetchIoTData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchIoTData = async () => {
    try {
      setRefreshing(true);
      // Use extended mock data for richer display
      const [sensorDataResponse] = await Promise.all([
        mockIoTService.getRecentSensorData(24)
      ]);
      
      setDevices(extendedMockDevices);
      setSensorData(sensorDataResponse);
      setAiPredictions(extendedMockAIPredictions);
      setAnomalies(extendedMockAnomalies);
      setError(null);
      setSuccess('Data refreshed successfully!');
    } catch (error) {
      console.error('Error fetching IoT data:', error);
      setError('Failed to fetch IoT data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getDeviceTypeIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'PARKING_SENSOR': return <Activity className="h-5 w-5" />;
      case 'CAMERA': return <Eye className="h-5 w-5" />;
      case 'GATE_CONTROLLER': return <Shield className="h-5 w-5" />;
      case 'PAYMENT_TERMINAL': return <Zap className="h-5 w-5" />;
      default: return <Cpu className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE': return 'text-green-600 bg-green-100';
      case 'OFFLINE': return 'text-red-600 bg-red-100';
      case 'MAINTENANCE': return 'text-yellow-600 bg-yellow-100';
      case 'ERROR': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleViewDetails = () => {
    setShowDeviceDetails(true);
  };

  const handleControlDevice = () => {
    setShowDeviceControl(true);
  };

  const getSelectedDevice = () => {
    return devices.find(d => d.deviceId === selectedDevice);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Error/Success Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl"
            >
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl"
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>{success}</span>
              </div>
            </motion.div>
          )}

          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center">
                <Network className="h-6 w-6 text-primary-600" />
              </div>
              <h1 className="text-3xl font-bold text-white">IoT Device Management</h1>
            </div>
            <p className="text-gray-300 text-lg">
              Real-time monitoring and AI-powered analytics for smart parking infrastructure
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card-elegant p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Devices</p>
                  <p className="text-2xl font-bold text-gray-900">{devices.length}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Cpu className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="card-elegant p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Online Devices</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {devices.filter(d => d.status === 'ONLINE').length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Wifi className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="card-elegant p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Sensors</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {sensorData.filter(s => s.quality === 'EXCELLENT').length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="card-elegant p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">AI Alerts</p>
                  <p className="text-2xl font-bold text-gray-900">{anomalies.length}</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Device List */}
            <div className="lg:col-span-2">
              <div className="card-elegant p-6">
                              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Connected Devices</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={fetchIoTData}
                    disabled={refreshing}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Refresh"
                  >
                    <RefreshCw className={`h-5 w-5 text-primary-600 ${refreshing ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={() => setShowAddDevice(true)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Add Device"
                  >
                    <Plus className="h-5 w-5 text-primary-600" />
                  </button>
                </div>
              </div>
                
                <div className="space-y-4">
                  {devices.map((device) => (
                    <div 
                      key={device.id} 
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedDevice === device.deviceId 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedDevice(device.deviceId)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            {getDeviceTypeIcon(device.deviceType)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{device.deviceName}</p>
                            <p className="text-sm text-gray-500">{device.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(device.status)}`}>
                            {device.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(device.lastSeen).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {devices.length === 0 && (
                    <div className="text-center py-8">
                      <Cpu className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No IoT devices connected</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

                                  {/* AI Analytics */}
                      <div className="space-y-6">
                        {/* Mock Data Test Component */}
                        <ApiTest />
              {/* Demand Prediction */}
              <div className="card-elegant p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">AI Predictions</h3>
                  <TrendingUp className="h-5 w-5 text-primary-600" />
                </div>
                
                {aiPredictions && (
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">
                        Predicted Bookings Today
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {aiPredictions.totalPredictedBookings || 0}
                      </p>
                    </div>
                    
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-900">
                        Peak Hours
                      </p>
                      <p className="text-sm text-green-600">
                        {aiPredictions.hourlyPredictions?.slice(0, 3).map((p: any) => 
                          `${p.hour}:00 (${p.predictedDemand})`
                        ).join(', ') || 'No data'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Anomalies */}
              <div className="card-elegant p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">AI Alerts</h3>
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                </div>
                
                <div className="space-y-3">
                  {anomalies.slice(0, 3).map((anomaly, index) => (
                    <div key={index} className="p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-red-900">
                            {anomaly.sensorType} Anomaly
                          </p>
                          <p className="text-xs text-red-600">
                            Device: {anomaly.deviceId}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          anomaly.severity === 'HIGH' ? 'bg-red-200 text-red-800' :
                          anomaly.severity === 'MEDIUM' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-blue-200 text-blue-800'
                        }`}>
                          {anomaly.severity}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {anomalies.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">No anomalies detected</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Real-time Data */}
              <div className="card-elegant p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Live Data</h3>
                  <Database className="h-5 w-5 text-primary-600" />
                </div>
                
                <div className="space-y-3">
                  {sensorData.slice(0, 5).map((data) => (
                    <div key={data.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{data.sensorType}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(data.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          {data.value} {data.unit}
                        </p>
                        <span className={`text-xs px-1 rounded ${
                          data.quality === 'EXCELLENT' ? 'bg-green-100 text-green-800' :
                          data.quality === 'GOOD' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {data.quality}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Device Details Modal */}
          {selectedDevice && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setSelectedDevice(null)}
            >
              <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Device Details</h2>
                  <button 
                    onClick={() => setSelectedDevice(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                {devices.find(d => d.deviceId === selectedDevice) && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Device ID</p>
                        <p className="font-medium">{selectedDevice}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="font-medium">{devices.find(d => d.deviceId === selectedDevice)?.status}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">IP Address</p>
                        <p className="font-medium">{devices.find(d => d.deviceId === selectedDevice)?.ipAddress}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Last Seen</p>
                        <p className="font-medium">
                          {new Date(devices.find(d => d.deviceId === selectedDevice)?.lastSeen || '').toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3 pt-4">
                      <button 
                        onClick={handleViewDetails}
                        className="btn-primary flex-1"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={handleControlDevice}
                        className="btn-secondary flex-1"
                      >
                        Control Device
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Add Device Modal */}
          {showAddDevice && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setShowAddDevice(false)}
            >
              <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Register New Device</h2>
                  <button 
                    onClick={() => setShowAddDevice(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <AddDeviceForm onSuccess={() => {
                  setShowAddDevice(false);
                  fetchIoTData();
                }} />
              </div>
            </motion.div>
          )}

          {/* Detailed Device Information Modal */}
          {showDeviceDetails && getSelectedDevice() && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setShowDeviceDetails(false)}
            >
              <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Detailed Device Information</h2>
                  <button 
                    onClick={() => setShowDeviceDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-6">
                  {(() => {
                    const device = getSelectedDevice();
                    return (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Device ID</p>
                          <p className="font-medium">{device?.deviceId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Device Name</p>
                          <p className="font-medium">{device?.deviceName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Device Type</p>
                          <p className="font-medium">{device?.deviceType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{device?.location}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <p className="font-medium">{device?.status}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">IP Address</p>
                          <p className="font-medium">{device?.ipAddress}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">MAC Address</p>
                          <p className="font-medium">{device?.macAddress || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Firmware Version</p>
                          <p className="font-medium">{device?.firmwareVersion || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Last Seen</p>
                          <p className="font-medium">
                            {new Date(device?.lastSeen || '').toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Created At</p>
                          <p className="font-medium">
                            {device?.createdAt ? new Date(device.createdAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Parking Slot</p>
                          <p className="font-medium">{device?.parkingSlot || 'N/A'}</p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Recent Sensor Data */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Recent Sensor Data</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {sensorData.filter(data => data.sensorType === getSelectedDevice()?.deviceType).slice(0, 3).map((data, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                          <div>
                            <p className="font-medium">{data.sensorType}</p>
                            <p className="text-sm text-gray-500">{data.unit}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{data.value}</p>
                            <p className="text-sm text-gray-500">{data.quality}</p>
                          </div>
                        </div>
                      ))}
                      {sensorData.filter(data => data.sensorType === getSelectedDevice()?.deviceType).length === 0 && (
                        <p className="text-gray-500 text-center py-4">No recent sensor data available</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Device Control Modal */}
          {showDeviceControl && getSelectedDevice() && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setShowDeviceControl(false)}
            >
              <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Device Control</h2>
                  <button 
                    onClick={() => setShowDeviceControl(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <p className="text-lg font-medium">{getSelectedDevice()?.deviceName}</p>
                    <p className="text-sm text-gray-500">{getSelectedDevice()?.deviceId}</p>
                  </div>

                  <div className="space-y-3">
                    <button 
                      onClick={() => {
                        setSuccess('Device restart command sent successfully!');
                        setShowDeviceControl(false);
                      }}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Restart Device
                    </button>
                    
                    <button 
                      onClick={() => {
                        setSuccess('Device calibration started!');
                        setShowDeviceControl(false);
                      }}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Calibrate Device
                    </button>
                    
                    <button 
                      onClick={() => {
                        setSuccess('Firmware update check initiated!');
                        setShowDeviceControl(false);
                      }}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Check for Updates
                    </button>
                    
                    <button 
                      onClick={() => {
                        setSuccess('Device diagnostics started!');
                        setShowDeviceControl(false);
                      }}
                      className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      Run Diagnostics
                    </button>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <button 
                      onClick={() => setShowDeviceControl(false)}
                      className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Add Device Form Component
const AddDeviceForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    deviceId: '',
    deviceName: '',
    deviceType: 'PARKING_SENSOR',
    location: '',
    ipAddress: '',
    macAddress: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await mockIoTService.registerDevice(formData);
      // Add the new device to extended mock data for display
      const newExtendedDevice: ExtendedIoTDevice = {
        id: extendedMockDevices.length + 1,
        deviceId: formData.deviceId,
        deviceName: formData.deviceName,
        deviceType: formData.deviceType,
        location: formData.location,
        status: 'ONLINE',
        ipAddress: formData.ipAddress,
        lastSeen: new Date().toISOString(),
        macAddress: formData.macAddress,
        firmwareVersion: 'v1.0.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        parkingSlot: null
      };
      extendedMockDevices.push(newExtendedDevice);
      onSuccess();
    } catch (error) {
      console.error('Error registering device:', error);
      alert('Failed to register device.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Device ID</label>
        <input
          type="text"
          required
          value={formData.deviceId}
          onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Enter device ID"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Device Name</label>
        <input
          type="text"
          required
          value={formData.deviceName}
          onChange={(e) => setFormData({ ...formData, deviceName: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Enter device name"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Device Type</label>
        <select
          value={formData.deviceType}
          onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="PARKING_SENSOR">Parking Sensor</option>
          <option value="CAMERA">Camera</option>
          <option value="GATE_CONTROLLER">Gate Controller</option>
          <option value="PAYMENT_TERMINAL">Payment Terminal</option>
          <option value="LIGHT_SENSOR">Light Sensor</option>
          <option value="WEATHER_SENSOR">Weather Sensor</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <input
          type="text"
          required
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Enter location"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">IP Address</label>
        <input
          type="text"
          value={formData.ipAddress}
          onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="192.168.1.100"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">MAC Address</label>
        <input
          type="text"
          value={formData.macAddress}
          onChange={(e) => setFormData({ ...formData, macAddress: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="00:11:22:33:44:55"
        />
      </div>
      
      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={() => onSuccess()}
          className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Registering...' : 'Register Device'}
        </button>
      </div>
    </form>
  );
};

export default IoTDashboard; 