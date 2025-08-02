import { Theme } from './src/theme'; // assuming you export `Theme` type in src/theme/index.ts
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

const ThemedScreen = () => {
    const { theme, toggleTheme } = useTheme();

    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Hello, Themed App!</Text>
            <Button
                title={theme.dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                color={theme.colors.primary}
                onPress={toggleTheme}
            />
        </View>
    );
};

export default function App() {
    return (
        <ThemeProvider>
            <ThemedScreen />
        </ThemeProvider>
    );
}

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
            justifyContent: 'center',
            alignItems: 'center',
            padding: theme.spacing.md,
        },
        text: {
            color: theme.colors.text,
            fontSize: theme.fonts.sizes.lg,
            fontFamily: theme.fonts.regular,
            marginBottom: theme.spacing.lg,
        },
    });
