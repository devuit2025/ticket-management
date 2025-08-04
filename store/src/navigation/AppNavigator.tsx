import React from 'react';

import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/navigationTypes';
import { useTheme } from '@context/ThemeContext';

import GlobalComponentsScreen from '@screens/dev/GlobalComponentsScreen';
import { HomeScreen } from '@screens/home';
import { LoginScreen } from '@screens/onboarding';
import { SelectPickupDropoffScreen } from '@screens/booking';
import { BookingNavigator } from '@navigation/BookingNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    const { theme } = useTheme();

    return (
        <NavigationContainer theme={theme.dark ? DarkTheme : DefaultTheme}>
            <Stack.Navigator
                initialRouteName="Booking"
                screenOptions={{
                    headerShown: false,
                }}
            >
                {/* <Stack.Screen name="SelectPickupDropoff" component={SelectPickupDropoffScreen} /> */}
                <Stack.Screen
                    name="Booking"
                    component={BookingNavigator}
                    options={{ headerShown: false }}
                />

                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen
                    name="GlobalComponents"
                    component={GlobalComponentsScreen}
                    options={{ title: 'Component Showcase' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
