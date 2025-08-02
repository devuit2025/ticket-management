import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PassengerInfoScreen = () => {
    return (
        <View style={styles.container}>
            <Text>PassengerInfoScreen</Text>
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

export default PassengerInfoScreen;
