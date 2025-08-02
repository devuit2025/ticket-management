import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Button = () => {
  return (
    <View style={styles.container}>
      <Text>Button component</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default Button;
