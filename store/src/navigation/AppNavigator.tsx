import React from 'react';

import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/navigationTypes';
import { useTheme } from '@context/ThemeContext';

import GlobalComponentsScreen from '@screens/dev/GlobalComponentsScreen';
import { HomeScreen } from '@screens/home';
import { LoginScreen } from '@screens/onboarding';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    const { theme } = useTheme();

    return (
        <NavigationContainer theme={theme.dark ? DarkTheme : DefaultTheme}>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerShown: false,
                }}
            >
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
