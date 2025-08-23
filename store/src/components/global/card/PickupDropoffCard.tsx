import React from 'react';
import { View, StyleSheet } from 'react-native';
import Card from '@components/global/card/Card';
import Typography from '@components/global/typography/Typography';
import { InfoRow } from '../typography/InfoRow';

interface PickupDropoffCardProps {
    pickup: string;
    dropoff: string;
}

export const PickupDropoffCard: React.FC<PickupDropoffCardProps> = ({ pickup, dropoff }) => (
    <Card style={{ marginBottom: 15 }}>
        <Typography variant="h2" weight="bold" style={styles.sectionTitle}>
            Pick-up & Drop-off
        </Typography>
        <InfoRow label="Pick-up" value={pickup} />
        <InfoRow label="Drop-off" value={dropoff} />
    </Card>
);

const styles = StyleSheet.create({
    sectionTitle: { marginBottom: 12 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
});
