import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Icon = () => {
    return (
        <View style={styles.container}>
            <Text>Icon component</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
});

export default Icon;
