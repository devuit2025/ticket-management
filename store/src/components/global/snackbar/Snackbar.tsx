import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Snackbar = () => {
    return (
        <View style={styles.container}>
            <Text>Snackbar component</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
});

export default Snackbar;
