import React from 'react';

import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/navigationTypes';
import { useTheme } from '@context/ThemeContext';

import GlobalComponentsScreen from '@screens/dev/GlobalComponentsScreen';
import { BookingNavigator } from '@navigation/BookingNavigator';
import BottomTabs from './BottomTabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    const { theme } = useTheme();

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
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
            </Stack.Navigator>
        </NavigationContainer>
    );
}
