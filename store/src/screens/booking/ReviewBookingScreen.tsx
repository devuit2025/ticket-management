import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ReviewBookingScreen = () => {
    return (
        <View style={styles.container}>
            <Text>ReviewBookingScreen</Text>
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

export default ReviewBookingScreen;
