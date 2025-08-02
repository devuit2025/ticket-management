import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RateReviewScreen = () => {
    return (
        <View style={styles.container}>
            <Text>RateReviewScreen</Text>
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

export default RateReviewScreen;
