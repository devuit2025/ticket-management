import React from 'react';
import { View, StyleSheet } from 'react-native';
import Card from '@components/global/card/Card';
import Typography from '@components/global/typography/Typography';
import { InfoRow } from '../typography/InfoRow';

interface DestinationCardProps {
    from: string;
    to: string;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ from, to }) => (
    <Card style={{ marginBottom: 15 }}>
        <Typography variant="h2" weight="bold" style={styles.sectionTitle}>
            Destination
        </Typography>
        <InfoRow label="From" value={from} />
        <InfoRow label="To" value={to} />
    </Card>
);
const styles = StyleSheet.create({
    sectionTitle: { marginBottom: 12 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
});
