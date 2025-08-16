import React from 'react';

import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/navigationTypes';
import { useTheme } from '@context/ThemeContext';

import GlobalComponentsScreen from '@screens/dev/GlobalComponentsScreen';
import BottomTabs from './BottomTabs';
import { BookingProvider } from '@context/BookingContext';
import {
    LoginScreen,
    PhoneLoginScreen,
    OtpVerificationScreen,
    RegisterScreen,
    ForgotPasswordScreen,
} from '@screens/onboarding';
import { BookingNavigator } from './BookingNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    const { theme } = useTheme();

    return (
        <BookingProvider>
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Booking"
                    screenOptions={{
                        headerShown: false,
                    }}
                >
                    <Stack.Screen name="Home" component={BottomTabs} />
                    <Stack.Screen
                        name="Booking"
                        component={BookingNavigator}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="GlobalComponents"
                        component={GlobalComponentsScreen}
                        options={{ title: 'Component Showcase' }}
                    />

                    <Stack.Screen name="LoginScreen" component={LoginScreen} />
                    <Stack.Screen name="PhoneLoginScreen" component={PhoneLoginScreen} />
                    <Stack.Screen name="OtpVerificationScreen" component={OtpVerificationScreen} />
                    <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
                    <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </BookingProvider>
    );
}
