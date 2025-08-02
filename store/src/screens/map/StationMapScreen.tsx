import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StationMapScreen = () => {
  return (
    <View style={styles.container}>
      <Text>StationMapScreen</Text>
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

export default StationMapScreen;
