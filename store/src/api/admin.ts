import client from './client';

// Admin Dashboard APIs
export const getDashboardStats = async () => {
  const response = await client.get('/admin/dashboard/stats');
  return response;
};

export const getRecentActivity = async () => {
  const response = await client.get('/admin/dashboard/activity');
  return response;
};

// Admin Trips APIs
export const getAdminTrips = async (params?: {
  status?: 'active' | 'scheduled' | 'completed';
  page?: number;
  limit?: number;
}) => {
  const response = await client.get('/admin/trips/list', { params });
  return response;
};

export const createTrip = async (tripData: {
  route_id: number;
  bus_id: number;
  driver_id: number;
  departure_time: string;
  price: number;
  note?: string;
}) => {
  const response = await client.post('/admin/trips', tripData);
  return response;
};

export const updateTrip = async (tripId: string, tripData: any) => {
  const response = await client.put(`/admin/trips/${tripId}`, tripData);
  return response;
};

export const deleteTrip = async (tripId: string) => {
  const response = await client.delete(`/admin/trips/${tripId}`);
  return response;
};

// Admin Bookings APIs
export const getAdminBookings = async (params?: {
  status?: 'pending' | 'confirmed' | 'cancelled';
  page?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
}) => {
  const response = await client.get('/admin/bookings', { params });
  return response;
};

export const updateBookingStatus = async (bookingId: string, status: 'confirmed' | 'cancelled') => {
  const response = await client.put(`/admin/bookings/${bookingId}/status`, { status });
  return response;
};

export const updateBookingPayment = async (bookingId: string, paymentStatus: 'paid' | 'unpaid') => {
  const response = await client.put(`/admin/bookings/${bookingId}/payment`, { payment_status: paymentStatus });
  return response;
};

export const cancelBooking = async (bookingId: string) => {
  const response = await client.put(`/admin/bookings/${bookingId}/cancel`);
  return response;
};

export const getBookingDetails = async (bookingId: string) => {
  const response = await client.get(`/admin/bookings/${bookingId}`);
  return response;
};

// Admin Users APIs
export const getAdminUsers = async (params?: {
  role?: 'user' | 'admin';
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const response = await client.get('/admin/users', { params });
  return response;
};

export const createUser = async (userData: {
  name: string;
  phone: string;
  password: string;
  role: string;
}) => {
  const response = await client.post('/admin/users/create', userData);
  return response;
};

export const updateUser = async (userId: string, userData: any) => {
  const response = await client.put(`/admin/users/${userId}`, userData);
  return response;
};

export const updateUserRole = async (userId: string, roleData: { role: string }) => {
  const response = await client.put(`/admin/users/${userId}/role`, roleData);
  return response;
};

export const createGuestBooking = async (bookingData: {
  trip_id: number;
  seat_ids: number[];
  payment_type: string;
  guest_info: {
    name: string;
    phone: string;
    email?: string;
  };
  note?: string;
}) => {
  const response = await client.post('/admin/create-booking', bookingData);
  return response;
};


export const deleteUser = async (userId: string) => {
  const response = await client.delete(`/admin/users/${userId}`);
  return response;
};

export const getUserStats = async (userId: string) => {
  const response = await client.get(`/admin/users/${userId}/stats`);
  return response;
};

// Additional APIs for Trip Management
export const getRoutes = async () => {
  const response = await client.get('/routes');
  return response;
};

export const getBuses = async () => {
  const response = await client.get('/buses');
  return response;
};

export const getDrivers = async () => {
  const response = await client.get('/admin/users', { params: { role: 'driver' } });
  return response;
};
