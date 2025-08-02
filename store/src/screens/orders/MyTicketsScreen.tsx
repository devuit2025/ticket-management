import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MyTicketsScreen = () => {
    return (
        <View style={styles.container}>
            <Text>MyTicketsScreen</Text>
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

export default MyTicketsScreen;
