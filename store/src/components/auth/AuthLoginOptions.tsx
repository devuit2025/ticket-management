import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Typography from '@components/global/typography/Typography';
import Icon from '@components/global/icon/Icon';

interface AuthLoginOptionsProps {
//   onSocialLogin: (type: 'phone' | 'facebook' | 'google') => void;
}

const AuthLoginOptions: React.FC<AuthLoginOptionsProps> = () => {
  const handleLoginPhone = () => {
    console.log('login phone');
  };

  const handleLoginFacebook = () => {
    console.log('login facebook');
  };

  const handleLoginGoogle = () => {
    console.log('login google');
  };


    return (
    <>
        <Typography variant="body" color="gray" style={{ textAlign: 'center', marginVertical: 10 }}>
        -- Or --
        </Typography>

        <View style={styles.socialRow}>
        <TouchableOpacity style={styles.socialButton} onPress={handleLoginPhone}>
            <Icon name="call-outline" size="xxl" color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton} onPress={handleLoginFacebook}>
            <Icon name="facebook" type="fa" size="xxl" color="#1877F2" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton} onPress={handleLoginGoogle}>
            <Icon name="google" type="mc" size="xxl" color="#DB4437" />
        </TouchableOpacity>
        </View>
    </>
    )
};

const styles = StyleSheet.create({
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
  },
  socialButton: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#E6F0FA',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
});

export default AuthLoginOptions;
