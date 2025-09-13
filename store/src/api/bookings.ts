import client from './client';

// --- Request / Response types ---
export interface GuestInfo {
    name: string;
    email?: string;
    phone: string;
    // any other guest info fields
}

export type PaymentType = 'cash'; // expand if more types exist
export type PaymentStatus = 'paid' | 'refunded';

export interface CreateBookingRequest {
    trip_id: number;
    seat_ids: number[];
    payment_type: PaymentType;
    guest_info?: GuestInfo;
    note?: string;
}

export interface Booking {
    id: number;
    trip_id: number;
    seat_ids: number[];
    total_amount: number;
    payment_type: PaymentType;
    payment_status: PaymentStatus;
    status: 'pending' | 'confirmed' | 'cancelled'; // adjust based on backend
    note?: string;
    guest_info?: GuestInfo;
    user_id?: number;
    created_at: string;
    updated_at: string;
}

export interface CreateBookingResponse {
    message: string;
    booking: Booking;
}

export interface UpdatePaymentRequest {
    payment_status: PaymentStatus;
}

// --- Client functions ---
export const createBooking = async (data: CreateBookingRequest): Promise<CreateBookingResponse> => {
    try {
        const response = await client.post<CreateBookingResponse>('/bookings', data);
        return response;
    } catch (error: any) {
        console.error('Error creating booking:', error);
        throw error;
    }
};

export const updatePayment = async (
    bookingId: number,
    data: UpdatePaymentRequest
): Promise<Booking> => {
    try {
        const response = await client.patch<Booking>(`/bookings/${bookingId}/payment`, data);
        return response;
    } catch (error: any) {
        console.error('Error updating payment:', error);
        throw error;
    }
};
