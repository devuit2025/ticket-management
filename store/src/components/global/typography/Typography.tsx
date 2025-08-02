import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Typography = () => {
  return (
    <View style={styles.container}>
      <Text>Typography component</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default Typography;
