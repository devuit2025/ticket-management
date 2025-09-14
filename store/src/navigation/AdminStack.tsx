import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminStackParamList } from './navigationTypes';
import AdminBottomTabs from './AdminBottomTabs';

const Stack = createNativeStackNavigator<AdminStackParamList>();

export default function AdminStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="AdminMain" component={AdminBottomTabs} />
        </Stack.Navigator>
    );
}
