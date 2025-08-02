import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LocationPickerScreen = () => {
    return (
        <View style={styles.container}>
            <Text>LocationPickerScreen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LocationPickerScreen;
