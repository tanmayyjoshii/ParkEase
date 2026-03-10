export interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface JwtResponse {
  token: string;
  type: string;
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface ParkingSlot {
  id: number;
  slotNumber: string;
  location: string;
  isAvailable: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: number;
  slotNumber: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  qrCode?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface BookingRequest {
  slotId: number;
  date: string;
  startTime: string;
  endTime: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}
