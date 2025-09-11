import React from 'react';

import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/navigationTypes';
import { BookingProvider } from '@context/BookingContext';
import { AuthGate } from './AuthGate';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <BookingProvider>
            <NavigationContainer>
                <AuthGate />
            </NavigationContainer>
        </BookingProvider>
    );
}
