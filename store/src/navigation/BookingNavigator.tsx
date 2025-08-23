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
    BookingConfirmation: undefined;
};

const Stack = createNativeStackNavigator<BookingStackParamList>();

export function BookingNavigator() {
    return (
        // <BookingProvider>
        <Stack.Navigator initialRouteName="SelectBus">
            <Stack.Screen name="SelectBus" component={SelectBusScreen} />
            <Stack.Screen name="SelectSeat" component={SelectSeatScreen} />
            <Stack.Screen name="ReviewBooking" component={ReviewBookingScreen} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
            <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
        </Stack.Navigator>
        // </BookingProvider>
    );
}
