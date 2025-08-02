import React from 'react';

import GlobalComponentsScreen from '@screens/dev/GlobalComponentsScreen';
import { HomeScreen } from '@screens/home';

import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/navigationTypes';
import { useTheme } from '@context/ThemeContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { theme } = useTheme();

  return (
    <NavigationContainer theme={theme.dark ? DarkTheme : DefaultTheme}>
      <Stack.Navigator initialRouteName='GlobalComponents'>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="GlobalComponents" component={GlobalComponentsScreen} options={{ title: 'Component Showcase' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
