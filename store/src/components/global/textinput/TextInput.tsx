import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TextInput = () => {
  return (
    <View style={styles.container}>
      <Text>TextInput component</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default TextInput;
