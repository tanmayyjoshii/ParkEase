import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, CheckCircle, XCircle, Clock, MapPin, User, Car, Calendar, Camera } from 'lucide-react';
import { parkingService } from '../services/parkingService';
import { Booking } from '../types';
import Navigation from '../components/Navigation';
import QRCodeScanner from '../components/QRCodeScanner';

const QRScanner: React.FC = () => {
  const [scanResult, setScanResult] = useState<string>('');
  const [bookingDetails, setBookingDetails] = useState<Booking | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showCamera, setShowCamera] = useState(false);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [showMyBookings, setShowMyBookings] = useState(false);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const bookings = await parkingService.getMyBookings();
      setMyBookings(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleScan = async (qrData: string) => {
    setScanning(true);
    setError('');
    setSuccess('');
    setBookingDetails(null);

    try {
      let bookingId: number;
      
      // Try to parse as JSON first (enhanced QR code)
      try {
        const qrJson = JSON.parse(qrData);
        if (qrJson.type === 'PARKING_BOOKING' && qrJson.bookingId) {
          bookingId = qrJson.bookingId;
        } else {
          throw new Error('Invalid QR code format');
        }
      } catch (jsonError) {
        // Fallback to simple booking ID (legacy QR code)
        bookingId = parseInt(qrData);
        if (isNaN(bookingId)) {
          throw new Error('Invalid QR code format');
        }
      }

      // Fetch booking details
      const booking = await parkingService.getBookingById(bookingId);
      setBookingDetails(booking);
      setScanResult(qrData);
      setSuccess('QR Code scanned successfully!');
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError(`Booking ID ${qrData} not found. Please check if the booking exists.`);
      } else if (err.response?.status === 401) {
        setError('Unauthorized. Please log in again.');
      } else {
        setError(err.message || 'Failed to scan QR code. Please try again.');
      }
    } finally {
      setScanning(false);
    }
  };

  const handleManualEntry = async () => {
    if (!scanResult.trim()) {
      setError('Please enter a booking ID');
      return;
    }
    await handleScan(scanResult.trim());
  };

  const handleCameraScan = (qrData: string) => {
    setShowCamera(false);
    handleScan(qrData);
  };

  const verifyAccess = () => {
    if (!bookingDetails) return false;
    
    const now = new Date();
    const bookingDate = new Date(bookingDetails.date);
    const startTime = new Date(`${bookingDetails.date}T${bookingDetails.startTime}`);
    const endTime = new Date(`${bookingDetails.date}T${bookingDetails.endTime}`);
    
    // Check if booking is for today and within time range
    const isToday = bookingDate.toDateString() === now.toDateString();
    const isWithinTime = now >= startTime && now <= endTime;
    const isActive = bookingDetails.status === 'ACTIVE';
    
    return isToday && isWithinTime && isActive;
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

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8 text-center">
            <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
              <QrCode className="h-8 w-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">QR Code Scanner</h1>
            <p className="text-gray-300 text-lg">
              Scan or enter QR codes to verify parking access
            </p>
          </motion.div>

          {/* Scanner Options */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="card-elegant p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Scan Options</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setShowCamera(true)}
                  className="btn-primary flex items-center justify-center space-x-2 p-4"
                >
                  <Camera className="h-5 w-5" />
                  <span>Use Camera</span>
                </button>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter booking ID..."
                    value={scanResult}
                    onChange={(e) => setScanResult(e.target.value)}
                    className="input-elegant flex-1"
                  />
                  <button
                    onClick={handleManualEntry}
                    disabled={scanning}
                    className="btn-primary flex items-center space-x-2"
                  >
                    {scanning ? (
                      <div className="spinner-small"></div>
                    ) : (
                      <QrCode className="h-4 w-4" />
                    )}
                    <span>Verify</span>
                  </button>
                </div>
              </div>
              
              {/* Help Text */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Tip:</strong> Try scanning a QR code from your bookings or enter a valid booking ID. 
                  You can also use the camera to scan QR codes directly.
                </p>
              </div>
              
              {/* My Bookings for Testing */}
              {myBookings.length > 0 && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowMyBookings(!showMyBookings)}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {showMyBookings ? 'Hide' : 'Show'} My Bookings for Testing
                  </button>
                  
                  {showMyBookings && (
                    <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Your bookings (click to test):</p>
                      <div className="space-y-2">
                        {myBookings.map((booking) => (
                          <button
                            key={booking.id}
                            onClick={() => setScanResult(booking.id.toString())}
                            className="block w-full text-left p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Booking #{booking.id}</span>
                              <span className="text-xs text-gray-500">
                                Slot {booking.slotNumber} - {new Date(booking.date).toLocaleDateString()}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Status Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl"
            >
              <div className="flex items-center space-x-2">
                <XCircle className="h-5 w-5" />
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

          {/* Booking Details */}
          {bookingDetails && (
            <motion.div
              variants={itemVariants}
              className="card-elegant p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Booking Details</h2>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  verifyAccess() 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {verifyAccess() ? 'ACCESS GRANTED' : 'ACCESS DENIED'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Car className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Parking Slot</p>
                      <p className="font-semibold text-gray-900">Slot {bookingDetails.slotNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-semibold text-gray-900">{bookingDetails.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-semibold text-gray-900">
                        {bookingDetails.startTime} - {bookingDetails.endTime}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(bookingDetails.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <User className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Booking ID</p>
                      <p className="font-semibold text-gray-900">#{bookingDetails.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-semibold text-gray-900">{bookingDetails.status}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Access Verification */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">Access Verification</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Booking Date: {new Date(bookingDetails.date).toLocaleDateString()}</span>
                    <span className={new Date(bookingDetails.date).toDateString() === new Date().toDateString() ? 'text-green-600' : 'text-red-600'}>
                      {new Date(bookingDetails.date).toDateString() === new Date().toDateString() ? '✓ Today' : '✗ Wrong Date'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Time Range: {bookingDetails.startTime} - {bookingDetails.endTime}</span>
                    <span className={verifyAccess() ? 'text-green-600' : 'text-red-600'}>
                      {verifyAccess() ? '✓ Within Time' : '✗ Outside Time'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Booking Status: {bookingDetails.status}</span>
                    <span className={bookingDetails.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}>
                      {bookingDetails.status === 'ACTIVE' ? '✓ Active' : '✗ Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Camera Scanner Modal */}
      <AnimatePresence>
        {showCamera && (
          <QRCodeScanner
            onScan={handleCameraScan}
            onClose={() => setShowCamera(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default QRScanner; 