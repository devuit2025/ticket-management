import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RadioButton = () => {
  return (
    <View style={styles.container}>
      <Text>RadioButton component</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default RadioButton;
