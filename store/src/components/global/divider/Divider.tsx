import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Divider = () => {
    return (
        <View style={styles.container}>
            <Text>Divider component</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
});

export default Divider;
