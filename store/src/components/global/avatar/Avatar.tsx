import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Avatar = () => {
  return (
    <View style={styles.container}>
      <Text>Avatar component</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default Avatar;
