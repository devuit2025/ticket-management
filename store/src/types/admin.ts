// Admin Dashboard Types
export interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  totalTrips: number;
  totalUsers: number;
  todayBookings: number;
  todayRevenue: number;
}

export interface RecentActivity {
  id: string;
  type: 'booking' | 'trip' | 'user';
  description: string;
  timestamp: string;
  userId?: string;
  userName?: string;
}

// Admin Trip Types
export interface AdminTrip {
  id: string;
  route: string;
  departureTime: string;
  arrivalTime: string;
  busNumber: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  date: string;
  status: 'active' | 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CreateTripRequest {
  route: string;
  departureTime: string;
  arrivalTime: string;
  busNumber: string;
  totalSeats: number;
  price: number;
  date: string;
}

// Admin Booking Types
export interface AdminBooking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  tripId: string;
  tripRoute: string;
  tripDate: string;
  seats: string[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  bookingTime: string;
  paymentMethod?: string;
  paymentStatus?: 'pending' | 'paid' | 'failed';
}

export interface BookingStatusUpdate {
  status: 'confirmed' | 'cancelled';
  reason?: string;
}

// Admin User Types
export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'user' | 'admin' | 'super_admin';
  totalBookings: number;
  totalSpent: number;
  joinDate: string;
  lastLogin?: string;
  isActive: boolean;
  avatar?: string;
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: 'user' | 'admin';
}

export interface UserStats {
  totalBookings: number;
  totalSpent: number;
  averageBookingValue: number;
  lastBookingDate?: string;
  favoriteRoutes: string[];
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
