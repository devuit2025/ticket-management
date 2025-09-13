import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { BookingData } from '@types';
import { getTrips, GetTripsParams, GetTripsResponse, Trip } from '@api/trips';
import { getRouteId } from '@utils/prepareLocations';
import dayjs from 'dayjs';
import {
    createBooking as apiCreateBooking,
    CreateBookingRequest,
    CreateBookingResponse,
    GuestInfo,
} from '@api/bookings';

interface BookingContextValue {
    bookingData: BookingData;
    setBookingData: React.Dispatch<React.SetStateAction<BookingData>>;
    trips: Trip[];
    tripsBack: Trip[];
    loading: boolean;
    loadingBack: boolean;
    fetchTripsForDay: () => Promise<void>;
    fetchTripsForDayBack: () => Promise<void>;
    createBooking: (guestInfo?: GuestInfo, note?: string) => Promise<CreateBookingResponse>;
}

const BookingContext = createContext<BookingContextValue | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
    const [bookingData, setBookingData] = useState<BookingData>({
        from: 'hcmc',
        to: null,
        day: null,
        daySelectedTrip: null,
        daySelectedSeatIds: [],
        daySelectedSeats: [],

        dayBack: null,
        dayBackSelectedTrip: null,

        numberOfTickets: null,
        routeId: undefined,
    });

    const [trips, setTrips] = useState<Trip[]>([]);
    const [tripsBack, setTripsBack] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingBack, setLoadingBack] = useState(false);

    const buildParamsForDate = (date: string | null): GetTripsParams | null => {
        if (!date || !bookingData.routeId) return null;
        // Only use YYYY-MM-DD for the current API
        const from_date = dayjs(date).startOf('day').toISOString(); // 2025-09-05T00:00:00.000Z
        const to_date = dayjs(date).endOf('day').toISOString(); // 2025-09-05T23:59:59.999Z
        return {
            route_id: bookingData.routeId,
            from_date,
            to_date,
        };
    };

    const fetchTripsForDay = async () => {
        const params = buildParamsForDate(bookingData.day);
        if (!params) return;

        setLoading(true);
        try {
            const response: GetTripsResponse = await getTrips(params);
            setTrips(response.trips);
        } catch (error) {
            console.error('Failed to fetch trips for day:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTripsForDayBack = async () => {
        const params = buildParamsForDate(bookingData.dayBack);
        if (!params) return;

        setLoadingBack(true);
        try {
            const response: GetTripsResponse = await getTrips(params);
            setTripsBack(response.trips);
        } catch (error) {
            console.error('Failed to fetch trips for dayBack:', error);
        } finally {
            setLoadingBack(false);
        }
    };

    const updateRouteId = async () => {
        if (!bookingData.from || !bookingData.to) return;

        try {
            const routeId = await getRouteId(bookingData.from, bookingData.to); // <-- await here
            setBookingData((prev: BookingData) => ({ ...prev, routeId }));
        } catch (error) {
            console.error('Failed to fetch routeId:', error);
        }
    };

    // --- New createBooking method ---
    const createBooking = async (
        user?: GuestInfo,
        note?: string
    ): Promise<CreateBookingResponse> => {
        if (!bookingData.daySelectedTrip || !bookingData.selectedSeats?.length) {
            throw new Error('Please select a trip and seats before booking.');
        }

        // Build request
        const request: CreateBookingRequest = {
            trip_id: bookingData.daySelectedTrip.id,
            seat_ids: bookingData.daySelectedSeatIds,
            payment_type: 'cash',
            guest_info: user,
            user_id: user.id,
            user: user,
            note,
        };

        try {
            const response = await apiCreateBooking(request);
            // optionally update bookingData or store booking info in context
            return response;
        } catch (error) {
            console.error('Failed to create booking:', error);
            throw error;
        }
    };

    useEffect(() => {
        updateRouteId();
    }, [bookingData.from, bookingData.to]);

    return (
        <BookingContext.Provider
            value={{
                bookingData,
                setBookingData,
                trips,
                tripsBack,
                loading,
                loadingBack,
                fetchTripsForDay,
                fetchTripsForDayBack,
                createBooking,
            }}
        >
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBooking must be used within BookingProvider');
    }
    return context;
};
