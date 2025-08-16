import React, { useEffect, useState } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
import * as Font from 'expo-font';
import { LanguageProvider } from '@i18n/LanguageProvider';
import { StyleSheet, View } from 'react-native';
import './assets/App.css';

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
        <View style={styles.appBackground}>
            <LanguageProvider>
                <ThemeProvider>
                    <AppNavigator />
                </ThemeProvider>
            </LanguageProvider>
        </View>
    );
}

const styles = StyleSheet.create({
    appBackground: {
        flex: 1,
    },
});
