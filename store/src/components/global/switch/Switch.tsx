import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Switch = () => {
  return (
    <View style={styles.container}>
      <Text>Switch component</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default Switch;
