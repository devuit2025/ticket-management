import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Checkbox = () => {
    return (
        <View style={styles.container}>
            <Text>Checkbox component</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
});

export default Checkbox;
