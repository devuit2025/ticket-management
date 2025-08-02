import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Loader = () => {
  return (
    <View style={styles.container}>
      <Text>Loader component</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default Loader;
