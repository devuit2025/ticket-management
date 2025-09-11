import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
    LoginScreen,
    PhoneLoginScreen,
    OtpVerificationScreen,
    RegisterScreen,
    ForgotPasswordScreen,
} from '@screens/onboarding';

const Stack = createNativeStackNavigator();

export const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} />
        <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
);
