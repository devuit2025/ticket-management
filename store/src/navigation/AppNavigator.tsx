import React from 'react';
import HomeScreen from '@screens/HomeScreen';
import ProfileScreen from '@screens/ProfileScreen';

import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@context/ThemeContext';
import { RootStackParamList } from '@navigation/navigationTypes';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { theme } = useTheme();

  return (
    <NavigationContainer theme={theme.dark ? DarkTheme : DefaultTheme}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
