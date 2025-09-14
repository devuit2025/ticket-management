import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    BookingConfirmationScreen,
    PaymentScreen,
    ReviewBookingScreen,
    SelectBusScreen,
    SelectSeatScreen,
} from '@screens/booking';

export type BookingStackParamList = {
    SelectBus: undefined;
    SelectSeat: undefined;
    ReviewBooking: undefined;
    Payment: undefined;
    BookingConfirmation: { bookingId?: string };
};

const Stack = createNativeStackNavigator<BookingStackParamList>();

export function BookingNavigator() {
    return (
        // <BookingProvider>
        <Stack.Navigator initialRouteName="SelectBus">
            <Stack.Screen
                name="SelectBus"
                component={SelectBusScreen}
                options={{ headerTitle: 'Select Bus' }}
            />
            <Stack.Screen
                name="SelectSeat"
                component={SelectSeatScreen}
                options={{ headerTitle: 'Select Seats' }}
            />
            <Stack.Screen
                name="ReviewBooking"
                component={ReviewBookingScreen}
                options={{ headerTitle: 'Review Booking' }}
            />
            <Stack.Screen
                name="Payment"
                component={PaymentScreen}
                options={{ headerTitle: 'Payment' }}
            />
            <Stack.Screen
                name="BookingConfirmation"
                component={BookingConfirmationScreen}
                options={{ headerTitle: 'Booking Confirmation' }}
            />
        </Stack.Navigator>
        // </BookingProvider>
    );
}
