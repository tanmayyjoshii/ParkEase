import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Search, Filter, MapPin, Clock, QrCode, Download, Plus, Star } from 'lucide-react';
import { parkingService } from '../services/parkingService';
import { Booking } from '../types';
import Navigation from '../components/Navigation';

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await parkingService.getMyBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQR = async (booking: Booking) => {
    try {
      const qrCode = await parkingService.generateQR(booking.id);
      setQrCodeUrl(qrCode);
      setSelectedBooking(booking);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.slotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

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
      transition: {
        duration: 0.5
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3
      }
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
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary-600" />
              </div>
              <h1 className="text-3xl font-bold text-white">My Bookings</h1>
            </div>
            <p className="text-gray-300 text-lg">
              Manage and track all your parking reservations
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-elegant pl-10 w-full"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input-elegant pl-10 appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bookings List */}
          <motion.div variants={itemVariants}>
            {filteredBookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredBookings.map((booking) => (
                    <motion.div
                      key={booking.id}
                      className="card-elegant p-6 group cursor-pointer"
                      variants={cardVariants}
                      whileHover={{ y: -4 }}
                      layout
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-10 w-10 bg-green-100 rounded-xl flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-green-600" />
                        </div>
                        <span className={`${
                          booking.status === 'ACTIVE' ? 'badge-success' :
                          booking.status === 'COMPLETED' ? 'badge-info' :
                          'badge-error'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Slot {booking.slotNumber}</h3>
                      
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{booking.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(booking.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{booking.startTime} - {booking.endTime}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGenerateQR(booking);
                          }}
                          className="btn-primary flex items-center space-x-2 text-sm"
                        >
                          <QrCode className="h-4 w-4" />
                          <span>View QR</span>
                        </button>
                        <Star className="h-4 w-4 text-yellow-400" />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                className="bg-white/50 backdrop-blur-sm rounded-2xl p-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No bookings found</h3>
                <p className="text-gray-500 mb-4">
                  {bookings.length === 0 
                    ? "You haven't made any bookings yet." 
                    : "No bookings match your search criteria."}
                </p>
                <Link to="/book-slot" className="btn-primary flex items-center space-x-2 mx-auto">
                  <Plus className="h-4 w-4" />
                  <span>Book Your First Slot</span>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {selectedBooking && qrCodeUrl && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setSelectedBooking(null);
              setQrCodeUrl(null);
            }}
          >
            <motion.div
              className="glass-card p-8 max-w-md w-full text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-white mb-4">QR Code</h3>
              <p className="text-gray-300 mb-6">
                Slot {selectedBooking.slotNumber} - {selectedBooking.location}
              </p>
              
              <div className="bg-white p-4 rounded-xl mb-6">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code" 
                  className="w-48 h-48 mx-auto"
                />
              </div>
              
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = qrCodeUrl;
                    link.download = `qr-code-booking-${selectedBooking.id}.png`;
                    link.click();
                  }}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
                
                <button
                  onClick={() => {
                    setSelectedBooking(null);
                    setQrCodeUrl(null);
                  }}
                  className="btn-secondary"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyBookings;
