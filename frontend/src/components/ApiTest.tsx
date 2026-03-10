import React, { useState } from 'react';
import { mockIoTService } from '../services/mockIoTData';

const ApiTest: React.FC = () => {
  const [testResults, setTestResults] = useState<any>({});
  const [testing, setTesting] = useState(false);

  const runApiTests = async () => {
    setTesting(true);
    const results: any = {};

    try {
      // Test 1: Get all devices
      try {
        const devices = await mockIoTService.getAllDevices();
        results.devices = { success: true, count: devices.length };
      } catch (error) {
        results.devices = { success: false, error: error };
      }

      // Test 2: Get system health
      try {
        const health = await mockIoTService.getSystemHealth();
        results.health = { success: true, data: health };
      } catch (error) {
        results.health = { success: false, error: error };
      }

      // Test 3: Get AI predictions
      try {
        const predictions = await mockIoTService.getDemandPrediction();
        results.predictions = { success: true, data: predictions };
      } catch (error) {
        results.predictions = { success: false, error: error };
      }

      // Test 4: Get anomalies
      try {
        const anomalies = await mockIoTService.detectAnomalies();
        results.anomalies = { success: true, count: anomalies.length };
      } catch (error) {
        results.anomalies = { success: false, error: error };
      }

    } catch (error) {
      console.error('API test error:', error);
    } finally {
      setTesting(false);
    }

    setTestResults(results);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Api Connection Test</h3>
      
      <button
        onClick={runApiTests}
        disabled={testing}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {testing ? 'Testing...' : 'Test Mock Data'}
      </button>

      {Object.keys(testResults).length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="font-medium">Test Results:</h4>
          {Object.entries(testResults).map(([test, result]: [string, any]) => (
            <div key={test} className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${result.success ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="font-medium">{test}:</span>
              <span className={result.success ? 'text-green-600' : 'text-red-600'}>
                {result.success ? 'SUCCESS' : 'FAILED'}
              </span>
              {result.success && result.count !== undefined && (
                <span className="text-gray-600">({result.count} items)</span>
              )}
              {!result.success && (
                <span className="text-red-500 text-sm">{result.error}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApiTest; 