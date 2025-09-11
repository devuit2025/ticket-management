import React, { useEffect, useRef, useState, forwardRef } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
import * as Font from 'expo-font';
import { LanguageProvider } from '@i18n/LanguageProvider';
import { StyleSheet, View } from 'react-native';
import './assets/App.css';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { setApiHandlerRef } from '@api/client';
import { ApiHandlerProvider } from '@context/ApiHandlerContext';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

export default function App() {
    const apiHandlerRef = useRef<any>(null);
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

        setApiHandlerRef(apiHandlerRef);

        loadFonts();
    }, []);

    return (
        <Provider store={store}>
            <ApiHandlerProvider ref={apiHandlerRef}>
                <View style={styles.appBackground}>
                    <LanguageProvider>
                        <ThemeProvider>
                            <AppNavigator />
                            <Toast
                                config={{
                                    success: (props: any) => (
                                        <BaseToast
                                            {...props}
                                            style={{ borderLeftColor: 'green' }}
                                            text1Style={{ fontSize: 14, fontWeight: 'bold' }} // bigger title
                                            text2Style={{ fontSize: 14 }} // bigger message
                                        />
                                    ),
                                    error: (props: any) => (
                                        <ErrorToast
                                            {...props}
                                            text1Style={{ fontSize: 14, fontWeight: 'bold' }}
                                            text2Style={{ fontSize: 14 }}
                                        />
                                    ),
                                    info: (props: any) => (
                                        <BaseToast
                                            {...props}
                                            style={{ borderLeftColor: 'blue' }}
                                            text1Style={{ fontSize: 14 }}
                                            text2Style={{ fontSize: 14 }}
                                        />
                                    ),
                                }}
                            />
                        </ThemeProvider>
                    </LanguageProvider>
                </View>
            </ApiHandlerProvider>
        </Provider>
    );
}

const styles = StyleSheet.create({
    appBackground: {
        flex: 1,
    },
});
