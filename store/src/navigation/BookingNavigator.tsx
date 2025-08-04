import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SelectPickupDropoffScreen from '@screens/booking/SelectPickupDropoffScreen';
import PassengerInfoScreen from '@screens/booking/PassengerInfoScreen';
import ReviewBookingScreen from '@screens/booking/ReviewBookingScreen';
import PaymentMethodScreen from '@screens/booking/PaymentMethodScreen';
import BookingConfirmationScreen from '@screens/booking/BookingConfirmationScreen';
import { BookingProvider } from '@context/BookingContext';

const Stack = createNativeStackNavigator();

export function BookingNavigator() {
    return (
        <BookingProvider>
            <Stack.Navigator
                initialRouteName="SelectPickupDropoff"
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen
                    name="SelectPickupDropoff"
                    component={SelectPickupDropoffScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="PassengerInfo"
                    component={PassengerInfoScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ReviewBooking"
                    component={ReviewBookingScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="PaymentMethod"
                    component={PaymentMethodScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="BookingConfirmation"
                    component={BookingConfirmationScreen}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </BookingProvider>
    );
}
