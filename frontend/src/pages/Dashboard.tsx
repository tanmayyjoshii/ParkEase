import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowRight, Plus, Search, Filter, Car, Calendar, MapPin } from 'lucide-react';
import { parkingService } from '../services/parkingService';
import { ParkingSlot, Booking } from '../types';
import Navigation from '../components/Navigation';

const Dashboard: React.FC = () => {
  const [availableSlots, setAvailableSlots] = useState<ParkingSlot[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [slotsData, bookingsData] = await Promise.all([
          parkingService.getAvailableSlots(),
          parkingService.getMyBookings()
        ]);
        setAvailableSlots(slotsData);
        setRecentBookings(bookingsData.slice(0, 3)); // Show only 3 recent bookings
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredSlots = availableSlots.filter(slot =>
    slot.slotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slot.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          {/* Welcome Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center">
                <Car className="h-6 w-6 text-primary-600" />
              </div>
              <h1 className="text-3xl font-bold text-white">Welcome back!</h1>
            </div>
            <p className="text-gray-300 text-lg">
              Here's what's happening with your parking today
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              className="card-elegant p-6 group cursor-pointer"
              variants={cardVariants}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Slots</p>
                  <p className="text-2xl font-bold text-gray-900">{availableSlots.length}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="card-elegant p-6 group cursor-pointer"
              variants={cardVariants}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {recentBookings.filter(b => b.status === 'ACTIVE').length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="card-elegant p-6 group cursor-pointer"
              variants={cardVariants}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{recentBookings.length}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Available Slots Section */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Available Slots</h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search slots..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-elegant pl-10 pr-4 w-64"
                  />
                </div>
                <button className="btn-primary flex items-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredSlots.length > 0 ? (
                  filteredSlots.map((slot) => (
                    <motion.div
                      key={slot.id}
                      className="card-elegant p-6 group cursor-pointer"
                      variants={cardVariants}
                      whileHover={{ y: -4 }}
                      layout
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-10 w-10 bg-primary-100 rounded-xl flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-primary-600" />
                        </div>
                        <span className="badge-success">Available</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Slot {slot.slotNumber}</h3>
                      <p className="text-gray-600 text-sm mb-4">{slot.location}</p>
                      {slot.description && (
                        <p className="text-gray-500 text-sm mb-4">{slot.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary-600">Available</span>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    className="col-span-full bg-white/50 backdrop-blur-sm rounded-2xl p-12 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No slots available</h3>
                    <p className="text-gray-500">Check back later for available parking slots.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Recent Bookings Section */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Recent Bookings</h2>
              <Link
                to="/my-bookings"
                className="btn-secondary flex items-center space-x-2"
              >
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
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
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
                        <p>Time: {booking.startTime} - {booking.endTime}</p>
                        <p>Location: {booking.location}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    className="col-span-full bg-white/50 backdrop-blur-sm rounded-2xl p-12 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No bookings yet</h3>
                    <p className="text-gray-500 mb-4">Start by booking your first parking slot.</p>
                    <Link to="/book-slot" className="btn-primary flex items-center space-x-2 mx-auto">
                      <Plus className="h-4 w-4" />
                      <span>Book Your First Slot</span>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

