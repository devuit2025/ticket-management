// InfoRow.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Typography from '@components/global/typography/Typography';

export const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.row}>
        <Typography variant="body" weight="medium" color="gray">
            {label}
        </Typography>
        <Typography variant="body" weight="bold">
            {value}
        </Typography>
    </View>
);

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
});
