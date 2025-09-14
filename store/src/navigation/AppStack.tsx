import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';
import { BookingNavigator } from './BookingNavigator';
import GlobalComponentsScreen from '@screens/dev/GlobalComponentsScreen';
import AdminDemoScreen from '@screens/dev/AdminDemoScreen';
import AuthTestScreen from '@screens/test/AuthTestScreen';
import AdminGuard from '@components/auth/AdminGuard';

const Stack = createNativeStackNavigator();

export const AppStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={BottomTabs} />
        <Stack.Screen name="Booking" component={BookingNavigator} />
        <Stack.Screen name="GlobalComponents" component={GlobalComponentsScreen} />
        <Stack.Screen name="AuthTest" component={AuthTestScreen} />
        <Stack.Screen 
            name="AdminDemo" 
            component={() => (
                <AdminGuard>
                    <AdminDemoScreen />
                </AdminGuard>
            )} 
        />
    </Stack.Navigator>
);
