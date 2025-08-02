import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Card = () => {
    return (
        <View style={styles.container}>
            <Text>Card component</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
});

export default Card;
