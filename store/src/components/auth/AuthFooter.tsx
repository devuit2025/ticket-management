import React from 'react';
import { View, StyleSheet } from 'react-native';
import Typography from '@components/global/typography/Typography';

interface AuthFooterProps {
  text: string;
  actionText: string;
}

const AuthFooter: React.FC<AuthFooterProps> = ({ text, actionText }) => (
  <View style={styles.container}>
    <Typography variant="body">
      {text}{' '}
      <Typography variant="body" color="primary" weight="bold">
        {actionText}
      </Typography>
    </Typography>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
});

export default AuthFooter;
