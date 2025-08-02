import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FAQScreen = () => {
  return (
    <View style={styles.container}>
      <Text>FAQScreen</Text>
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

export default FAQScreen;
