import React from 'react';
import { View, StyleSheet } from 'react-native';
import Card from '@components/global/card/Card';
import Typography from '@components/global/typography/Typography';
import { InfoRow } from '../typography/InfoRow';

interface Passenger {
    fullName: string;
    phone: string;
    email: string;
    type: string;
    specialRequests?: string;
}

interface PassengerCardProps {
    customer: Passenger;
}

export const PassengerCard: React.FC<PassengerCardProps> = ({ customer }) => (
    <Card style={{ marginBottom: 15 }}>
        <Typography variant="h2" weight="bold" style={styles.sectionTitle}>
            Passenger Information
        </Typography>
        <InfoRow label="Full Name" value={customer.fullName} />
        <InfoRow label="Phone" value={customer.phone} />
        <InfoRow label="Email" value={customer.email} />
        <InfoRow label="Passenger Type" value={customer.type} />
        {customer.specialRequests && (
            <InfoRow label="Special Requests" value={customer.specialRequests} />
        )}
    </Card>
);

const styles = StyleSheet.create({
    sectionTitle: { marginBottom: 12 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
});
