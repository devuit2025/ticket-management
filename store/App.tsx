import React, { useEffect, useState } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
import * as Font from 'expo-font';

export default function App() {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                'Inter-Regular': require('./assets/selected-font/Inter-Regular.ttf'),
                'Inter-Medium': require('./assets/selected-font/Inter-Medium.ttf'),
                'Inter-Bold': require('./assets/selected-font/Inter-Bold.ttf'),
            });
            setFontsLoaded(true);
        };

        loadFonts();
    }, []);

    return (
        <ThemeProvider>
            <AppNavigator />
        </ThemeProvider>
    );
}
