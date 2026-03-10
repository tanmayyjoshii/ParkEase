import api from './authService';
import { ParkingSlot, Booking, BookingRequest } from '../types';

export const parkingService = {
  // Slot-related APIs
  async getAvailableSlots(): Promise<ParkingSlot[]> {
    const response = await api.get<ParkingSlot[]>('/slots/available');
    return response.data;
  },

  async getAllSlots(): Promise<ParkingSlot[]> {
    const response = await api.get<ParkingSlot[]>('/admin/slots');
    return response.data;
  },

  async createSlot(slot: Omit<ParkingSlot, 'id' | 'createdAt' | 'updatedAt'>): Promise<ParkingSlot> {
    const response = await api.post<ParkingSlot>('/admin/slots/add', slot);
    return response.data;
  },

  async updateSlot(id: number, slot: Partial<ParkingSlot>): Promise<ParkingSlot> {
    const response = await api.put<ParkingSlot>(`/admin/slots/update/${id}`, slot);
    return response.data;
  },

  async deleteSlot(id: number): Promise<void> {
    await api.delete(`/admin/slots/delete/${id}`);
  },

  // Booking-related APIs
  async bookSlot(bookingRequest: BookingRequest): Promise<Booking> {
    const response = await api.post<Booking>('/slots/book', bookingRequest);
    return response.data;
  },

  async getMyBookings(): Promise<Booking[]> {
    const response = await api.get<Booking[]>('/slots/my-bookings');
    return response.data;
  },

  async getAllBookings(): Promise<Booking[]> {
    const response = await api.get<Booking[]>('/admin/bookings');
    return response.data;
  },

  async generateQR(bookingId: number): Promise<string> {
    const response = await api.post<string>(`/slots/generate-qr`, bookingId);
    return response.data;
  },

  // Reports
  async getReports(): Promise<any> {
    const response = await api.get('/admin/reports');
    return response.data;
  },

  // Additional utility methods
  async cancelBooking(bookingId: number): Promise<void> {
    await api.put(`/slots/cancel/${bookingId}`);
  },

  async getBookingById(bookingId: number): Promise<Booking> {
    const response = await api.get<Booking>(`/slots/booking/${bookingId}`);
    return response.data;
  },

  async updateBookingStatus(bookingId: number, status: string): Promise<Booking> {
    const response = await api.put<Booking>(`/slots/booking/${bookingId}/status`, { status });
    return response.data;
  }
};
