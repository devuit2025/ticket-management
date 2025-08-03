import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SpinnerLoader from '@components/global/loader/SpinnerLoader';
import ProgressLoader from '@components/global/loader/ProgressLoader';

const Loader = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => (prev < 1 ? prev + 0.05 : 1));
        }, 300);

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.section}>
            <Text style={styles.heading}>Loader</Text>

            <Text style={styles.subheading}>Spinner Loader</Text>
            <SpinnerLoader size="large" />

            <Text style={styles.subheading}>Progress Loader</Text>
            <ProgressLoader progress={progress} label="Uploading Ticket Info..." />
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 24,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    subheading: {
        marginTop: 16,
        marginBottom: 8,
        fontSize: 14,
        fontWeight: '500',
    },
});

export default Loader;
