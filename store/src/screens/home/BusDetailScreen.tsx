import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BusDetailScreen = () => {
    return (
        <View style={styles.container}>
            <Text>BusDetailScreen</Text>
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

export default BusDetailScreen;
