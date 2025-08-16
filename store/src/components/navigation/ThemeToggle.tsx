import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useTheme } from '@context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <View style={styles.container}>
            <Text style={{ color: theme.colors.text, fontSize: 16, marginRight: 10 }}>
                {theme.dark ? 'Dark Mode' : 'Light Mode'}
            </Text>
            <Switch
                value={theme.dark}
                onValueChange={toggleTheme}
                trackColor={{ false: '#ccc', true: '#333' }}
                thumbColor="#fff"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
});

export default ThemeToggle;
