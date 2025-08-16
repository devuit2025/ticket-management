import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PaymentScreen = () => {
    return (
        <View style={styles.container}>
            <Text>PaymentScreen</Text>
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

export default PaymentScreen;
