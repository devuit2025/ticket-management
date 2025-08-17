import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    BookingSuccessScreen,
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
    BookingSuccess: undefined;
};

const Stack = createNativeStackNavigator<BookingStackParamList>();

export function BookingNavigator() {
    return (
        // <BookingProvider>
        <Stack.Navigator initialRouteName="SelectSeat">
            {/* <Stack.Screen
                name="SelectBusScreen"
                component={SelectBusScreen}
                options={{ headerShown: true }}
            />

            <Stack.Screen name="SelectSeatScreen" component={SelectSeatScreen} />
            <Stack.Screen name="ReviewBookingScreen" component={ReviewBookingScreen} />
            <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
            <Stack.Screen name="BookingSuccessScreen" component={BookingSuccessScreen} /> */}
            <Stack.Screen name="SelectBus" component={SelectBusScreen} />
            <Stack.Screen name="SelectSeat" component={SelectSeatScreen} />
            <Stack.Screen name="ReviewBooking" component={ReviewBookingScreen} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
            <Stack.Screen name="BookingSuccess" component={BookingSuccessScreen} />
        </Stack.Navigator>
        // </BookingProvider>
    );
}
