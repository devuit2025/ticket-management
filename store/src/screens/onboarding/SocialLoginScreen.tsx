import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SocialLoginScreen = () => {
    return (
        <View style={styles.container}>
            <Text>SocialLoginScreen</Text>
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

export default SocialLoginScreen;
