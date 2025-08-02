import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SearchResultScreen = () => {
  return (
    <View style={styles.container}>
      <Text>SearchResultScreen</Text>
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

export default SearchResultScreen;
