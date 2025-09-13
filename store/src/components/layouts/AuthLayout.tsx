import Card from '@components/global/card/Card';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Card>{children}</Card>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        backgroundColor: '#1d50f7ff',
        padding: 20,
    },
});

export default AuthLayout;
