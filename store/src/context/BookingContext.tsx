// src/context/BookingContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BookingData {
    pickupLocation?: string;
    dropoffLocation?: string;
    passengers?: Array<{ name: string; age: number }>;
    paymentMethod?: string;
    // add other booking fields as needed
}

interface BookingContextValue {
    bookingData: BookingData;
    setBookingData: React.Dispatch<React.SetStateAction<BookingData>>;
}

const BookingContext = createContext<BookingContextValue | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
    const [bookingData, setBookingData] = useState<BookingData>({});

    return (
        <BookingContext.Provider value={{ bookingData, setBookingData }}>
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
