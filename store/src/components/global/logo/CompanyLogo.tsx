import React from 'react';
import { Image, StyleSheet } from 'react-native';

const CompanyLogo = () => {
    return (
        <Image
            source={require('../../../../assets/share/logo.png')}
            style={styles.logo}
            resizeMode="contain"
        />
    );
};

const styles = StyleSheet.create({
    logo: {
        width: 120,
        height: 40,
        marginLeft: 10,
    },
});

export default CompanyLogo;
