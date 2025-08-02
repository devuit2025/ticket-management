import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Modal = () => {
    return (
        <View style={styles.container}>
            <Text>Modal component</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
});

export default Modal;
