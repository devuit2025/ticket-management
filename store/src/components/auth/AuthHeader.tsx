import React from 'react';
import { Image, StyleSheet } from 'react-native';
import Typography from '@components/global/typography/Typography';

interface AuthHeaderProps {
  title: string;
subtitle?: string;
  image: any;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle, image }) => (
  <>
    <Image source={image} style={styles.image} resizeMode="contain" />
    <Typography variant="h1" weight="bold" style={styles.title}>
      {title}
    </Typography>
          <Typography variant="body" color="gray" style={styles.subtitle}>
        {subtitle}
      </Typography>
  </>
);

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 120,
    marginBottom: 20,
    borderRadius: 12,
  },
  title: {
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
  },

});

export default AuthHeader;
