import React from 'react';

// Import from feature folder index files
import { HomeScreen, SearchResultScreen, BusDetailScreen } from '@screens/home';
import { MyAccountScreen, PreferencesScreen, SavedCardsScreen, SettingsScreen } from '@screens/profile';

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
        {/* Example screens from home */}
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* <Stack.Screen name="SearchResult" component={SearchResultScreen} />
        <Stack.Screen name="BusDetail" component={BusDetailScreen} />

        <Stack.Screen name="MyAccount" component={MyAccountScreen} />
        <Stack.Screen name="Preferences" component={PreferencesScreen} />
        <Stack.Screen name="SavedCards" component={SavedCardsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
