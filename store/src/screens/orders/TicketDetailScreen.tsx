import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TicketDetailScreen = () => {
  return (
    <View style={styles.container}>
      <Text>TicketDetailScreen</Text>
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

export default TicketDetailScreen;
