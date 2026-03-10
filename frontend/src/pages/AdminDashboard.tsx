import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, MapPin, Calendar, BarChart3, TrendingUp, DollarSign, Clock, Car } from 'lucide-react';
import { parkingService } from '../services/parkingService';
import { ParkingSlot, Booking } from '../types';
import Navigation from '../components/Navigation';

const AdminDashboard: React.FC = () => {
  const [reports, setReports] = useState<any>(null);
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    fetchAdminData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAdminData = async () => {
    try {
      const [reportsData, slotsData, bookingsData] = await Promise.all([
        parkingService.getReports(),
        parkingService.getAllSlots(),
        parkingService.getAllBookings()
      ]);
      
      setReports(reportsData);
      setSlots(slotsData);
      setBookings(bookingsData);
      
      // Process data for charts
      processChartData(bookingsData, slotsData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (bookings: Booking[], slots: ParkingSlot[]) => {
    // Process bookings by date for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const bookingsByDate = last7Days.map(date => ({
      date,
      count: bookings.filter(b => b.date === date).length
    }));

    // Process slot utilization
    const totalSlots = slots.length;
    const occupiedSlots = slots.filter(s => !s.isAvailable).length;
    const availableSlots = totalSlots - occupiedSlots;

    // Process booking status distribution
    const statusCounts = bookings.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate revenue (assuming $10 per booking)
    const totalRevenue = bookings.length * 10;
    const monthlyRevenue = bookings.filter(b => {
      const bookingDate = new Date(b.date);
      const now = new Date();
      return bookingDate.getMonth() === now.getMonth() && 
             bookingDate.getFullYear() === now.getFullYear();
    }).length * 10;

    setChartData({
      bookingsByDate,
      slotUtilization: { total: totalSlots, occupied: occupiedSlots, available: availableSlots },
      statusDistribution: statusCounts,
      revenue: { total: totalRevenue, monthly: monthlyRevenue }
    });
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

  const renderChart = (data: any[], title: string, color: string) => {
    const maxValue = Math.max(...data.map(d => d.count), 1);
    
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        <div className="flex items-end space-x-1 h-24">
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full rounded-t"
                style={{
                  height: `${(item.count / maxValue) * 80}px`,
                  backgroundColor: color,
                  opacity: 0.8
                }}
              />
              <span className="text-xs text-gray-500 mt-1">
                {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPieChart = (data: Record<string, number>, title: string) => {
    const total = Object.values(data).reduce((sum, count) => sum + count, 0);
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        <div className="flex items-center justify-center h-24">
          <div className="relative w-20 h-20">
            {Object.entries(data).map(([status, count], index) => {
              const percentage = total > 0 ? (count / total) * 100 : 0;
              const rotation = Object.entries(data)
                .slice(0, index)
                .reduce((sum, [, c]) => sum + (c / total) * 360, 0);
              
              return (
                <div
                  key={status}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(${colors[index % colors.length]} ${rotation}deg, ${colors[index % colors.length]} ${rotation + (percentage * 3.6)}deg, transparent ${rotation + (percentage * 3.6)}deg)`
                  }}
                />
              );
            })}
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">{total}</span>
            </div>
          </div>
        </div>
        <div className="space-y-1">
          {Object.entries(data).map(([status, count], index) => (
            <div key={status} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-gray-600">{status}</span>
              </div>
              <span className="font-medium">{count}</span>
            </div>
          ))}
        </div>
      </div>
    );
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
                <BarChart3 className="h-6 w-6 text-primary-600" />
              </div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <p className="text-gray-300 text-lg">
              Real-time analytics and insights for parking management
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              className="card-elegant p-6 group cursor-pointer"
              variants={cardVariants}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{reports?.totalUsers || 0}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
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
                  <p className="text-sm font-medium text-gray-600">Total Slots</p>
                  <p className="text-2xl font-bold text-gray-900">{reports?.totalSlots || 0}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-green-600" />
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
                  <p className="text-2xl font-bold text-gray-900">{reports?.totalBookings || 0}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-purple-600" />
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
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${chartData?.revenue?.monthly || 0}</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Charts Section */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Booking Trends Chart */}
            <div className="card-elegant p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Booking Trends</h2>
                <TrendingUp className="h-5 w-5 text-primary-600" />
              </div>
              {chartData?.bookingsByDate ? (
                renderChart(chartData.bookingsByDate, 'Last 7 Days', '#3B82F6')
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No booking data available</p>
                </div>
              )}
            </div>

            {/* Slot Utilization */}
            <div className="card-elegant p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Slot Utilization</h2>
                <Car className="h-5 w-5 text-primary-600" />
              </div>
              {chartData?.slotUtilization ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Slots</span>
                    <span className="font-semibold">{chartData.slotUtilization.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${chartData.slotUtilization.total > 0 ? 
                          ((chartData.slotUtilization.occupied / chartData.slotUtilization.total) * 100) : 0}%` 
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600">Available</p>
                      <p className="text-xl font-bold text-green-900">{chartData.slotUtilization.available}</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-600">Occupied</p>
                      <p className="text-xl font-bold text-red-900">{chartData.slotUtilization.occupied}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No slot data available</p>
                </div>
              )}
            </div>

            {/* Booking Status Distribution */}
            <div className="card-elegant p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Booking Status</h2>
                <Clock className="h-5 w-5 text-primary-600" />
              </div>
              {chartData?.statusDistribution && Object.keys(chartData.statusDistribution).length > 0 ? (
                renderPieChart(chartData.statusDistribution, 'Status Distribution')
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No booking status data</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Bookings */}
            <div className="card-elegant p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
                <TrendingUp className="h-5 w-5 text-primary-600" />
              </div>
              
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Slot {booking.slotNumber}</p>
                        <p className="text-sm text-gray-500">{booking.location}</p>
                      </div>
                    </div>
                    <span className={`${
                      booking.status === 'ACTIVE' ? 'badge-success' :
                      booking.status === 'COMPLETED' ? 'badge-info' :
                      'badge-error'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                ))}
                
                {bookings.length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No bookings yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Parking Slots Status */}
            <div className="card-elegant p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Parking Slots Status</h2>
                <MapPin className="h-5 w-5 text-primary-600" />
              </div>
              
              <div className="space-y-4">
                {slots.slice(0, 5).map((slot) => (
                  <div key={slot.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                        slot.isAvailable ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <MapPin className={`h-4 w-4 ${
                          slot.isAvailable ? 'text-green-600' : 'text-red-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Slot {slot.slotNumber}</p>
                        <p className="text-sm text-gray-500">{slot.location}</p>
                      </div>
                    </div>
                    <span className={`${
                      slot.isAvailable ? 'badge-success' : 'badge-error'
                    }`}>
                      {slot.isAvailable ? 'Available' : 'Occupied'}
                    </span>
                  </div>
                ))}
                
                {slots.length === 0 && (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No parking slots configured</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Additional Stats */}
          <motion.div variants={itemVariants} className="mt-8">
            <div className="card-elegant p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Today's Statistics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-600">Today's Bookings</p>
                  <p className="text-2xl font-bold text-blue-900">{reports?.todayBookings || 0}</p>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-600">Monthly Bookings</p>
                  <p className="text-2xl font-bold text-green-900">{reports?.monthlyBookings || 0}</p>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-purple-600">Utilization Rate</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {reports?.totalSlots ? Math.round(((reports.totalSlots - reports.availableSlots) / reports.totalSlots) * 100) : 0}%
                  </p>
                </div>

                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm font-medium text-yellow-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-yellow-900">${chartData?.revenue?.total || 0}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
