import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { BookingData } from '@types';

interface BookingContextValue {
    bookingData: BookingData;
    setBookingData: React.Dispatch<React.SetStateAction<BookingData>>;
}

const BookingContext = createContext<BookingContextValue | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
    const [bookingData, setBookingData] = useState<BookingData>({
        from: 'hcmc',
        to: null,
        day: null,
        dayBack: null,
        numberOfTickets: null,
    });

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
