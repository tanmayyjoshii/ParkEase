import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Calendar, Clock, MapPin, CheckCircle, ArrowLeft, Plus, Star } from 'lucide-react';
import { parkingService } from '../services/parkingService';
import { ParkingSlot, BookingRequest } from '../types';
import Navigation from '../components/Navigation';

const BookSlot: React.FC = () => {
  const [availableSlots, setAvailableSlots] = useState<ParkingSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState<BookingRequest>({
    slotId: 0,
    date: '',
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        console.log('Fetching available slots...');
        const slots = await parkingService.getAvailableSlots();
        console.log('Available slots received:', slots);
        setAvailableSlots(slots);
      } catch (error) {
        console.error('Error fetching available slots:', error);
        setError('Failed to load available slots. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableSlots();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Validate form data
      if (!formData.slotId || !formData.date || !formData.startTime || !formData.endTime) {
        throw new Error('Please fill in all fields');
      }

      // Convert date and time strings to proper format
      const bookingData: BookingRequest = {
        ...formData,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
      };

      await parkingService.bookSlot(bookingData);
      setSuccess(true);
      
      // Redirect to my bookings after 2 seconds
      setTimeout(() => {
        navigate('/my-bookings');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
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

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-dark">
        <Navigation />
        
        <motion.div 
          className="glass-card p-8 text-center space-y-6 max-w-md w-full mx-auto mt-20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-3xl font-black text-white mb-2">
            Booking Successful!
          </h2>
          <p className="text-indigo-100">
            Your parking slot has been booked successfully. Redirecting to bookings...
          </p>
          <motion.div
            className="w-full bg-white bg-opacity-20 rounded-full h-2"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />
      
      <motion.div 
        className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="inline-block mb-6"
          >
            <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl mx-auto">
              <Plus className="h-8 w-8 text-primary-600" />
            </div>
          </motion.div>
          
          <h1 className="text-5xl font-black text-white mb-4 text-gradient">
            Book Your Parking Slot
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Choose your preferred slot and time to secure your parking spot
          </p>
        </motion.div>

        {/* Booking Form */}
        <motion.div 
          className="glass-card p-8"
          variants={itemVariants}
        >
          <form className="space-y-8" onSubmit={handleSubmit}>
            {error && (
              <motion.div 
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="font-medium">{error}</span>
              </motion.div>
            )}

            {/* Slot Selection */}
            <div className="space-y-3">
              <label htmlFor="slotId" className="block text-lg font-semibold text-white">
                Select Parking Slot
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Car className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="slotId"
                  name="slotId"
                  value={formData.slotId}
                  onChange={handleChange}
                  required
                  className="input-elegant pl-10 appearance-none cursor-pointer"
                >
                  <option value="">-- Choose your parking slot --</option>
                  {availableSlots.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      Slot {slot.slotNumber} - {slot.location}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {availableSlots.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl">
                  <p className="text-sm font-medium">No available slots at the moment. Please check back later.</p>
                  <p className="text-xs mt-1">Debug: {availableSlots.length} slots loaded</p>
                </div>
              )}
            </div>

            {/* Date Selection */}
            <div className="space-y-3">
              <label htmlFor="date" className="block text-lg font-semibold text-white">
                Select Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="input-elegant pl-10"
                />
              </div>
            </div>

            {/* Time Selection */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-white">
                Select Time
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    className="input-elegant pl-10"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    className="input-elegant pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-secondary flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </button>
              
              <button
                type="submit"
                disabled={submitting || availableSlots.length === 0}
                className="btn-primary flex items-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="spinner"></div>
                    <span>Booking...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Book Slot</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Available Slots Preview */}
        {availableSlots.length > 0 && (
          <motion.div 
            className="mt-12"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Available Slots Preview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableSlots.slice(0, 6).map((slot) => (
                <motion.div
                  key={slot.id}
                  className="card-elegant p-6 group cursor-pointer"
                  whileHover={{ y: -4 }}
                  onClick={() => setFormData({ ...formData, slotId: slot.id })}
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
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm text-gray-500">Click to select</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default BookSlot;

