import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';
import { BookingNavigator } from './BookingNavigator';
import GlobalComponentsScreen from '@screens/dev/GlobalComponentsScreen';

const Stack = createNativeStackNavigator();

export const AppStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={BottomTabs} />
        <Stack.Screen name="Booking" component={BookingNavigator} />
        <Stack.Screen name="GlobalComponents" component={GlobalComponentsScreen} />
    </Stack.Navigator>
);
