import client from './client'; // axios instance or similar

// Trip data type
export interface Trip {
    id: number;
    route_id: number;
    start_time: string;
    end_time: string;
    price: number;
    car_type: string;
    available_seats: number;
    start_location: string;
    end_location: string;
    is_active: boolean;
    is_completed: boolean;
    created_at: string;
    updated_at: string;
}

// Response type
export interface GetTripsResponse {
    trips: Trip[];
    total: number;
}

// Optional query parameters
export interface GetTripsParams {
    route_id?: number;
    from_date?: string; // "YYYY-MM-DD"
    to_date?: string; // "YYYY-MM-DD"
    min_price?: number;
    max_price?: number;
}

// Type for individual seat
export interface Seat {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    trip_id: number;
    number: string;
    floor: number;
    type: 'single' | 'double'; // adjust if there are more types
    status: 'available' | 'booked' | 'unavailable'; // adjust if more statuses exist
    price: number;
}

// Type for floor with seats
export interface Floor {
    floor: number;
    seats: Seat[];
}

// Type for trip info
export interface TripInfo {
    base_price: number;
    bus_type: string;
    departure_time: string;
    id: number;
    route: string;
}

// Full response type
export interface GetTripSeatsResponse {
    floors: Floor[];
    trip_info: TripInfo;
}

// --- Fetch trips from API ---
export const getTrips = async (params?: GetTripsParams): Promise<GetTripsResponse> => {
    try {
        const response = await client.get<GetTripsResponse>('/trips', {
            params,
        });
        return response;
    } catch (error: any) {
        console.error('Error fetching trips:', error);
        throw error;
    }
};

export const getTripSeats = async (tripId: number): Promise<GetTripSeatsResponse> => {
    try {
        const response = await client.get<GetTripSeatsResponse>(`/trips/${tripId}/seats`);
        return response;
    } catch (error: any) {
        console.error('Error fetching trip seats:', error);
        throw error;
    }
};
