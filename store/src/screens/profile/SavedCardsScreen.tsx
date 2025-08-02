import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SavedCardsScreen = () => {
    return (
        <View style={styles.container}>
            <Text>SavedCardsScreen</Text>
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

export default SavedCardsScreen;
