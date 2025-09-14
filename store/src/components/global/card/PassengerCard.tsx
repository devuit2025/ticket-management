import React from 'react';
import { View, StyleSheet } from 'react-native';
import Card from '@components/global/card/Card';
import Typography from '@components/global/typography/Typography';
import { InfoRow } from '../typography/InfoRow';
import { useTranslation } from '@i18n/useTranslation';

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

export const PassengerCard: React.FC<PassengerCardProps> = ({ customer }) => {
    const { translate } = useTranslation();
    
    return (
        <Card style={{ marginBottom: 15 }}>
            <Typography variant="h2" weight="bold" style={styles.sectionTitle}>
                {translate('booking.passengerInfo')}
            </Typography>
            <InfoRow label={translate('common.fullName')} value={customer.fullName} />
            <InfoRow label={translate('common.phone')} value={customer.phone} />
            {/* <InfoRow label={translate('common.email')} value={customer.email} /> */}
            <InfoRow label={translate('common.passengerType')} value={customer.type} />
            {customer.specialRequests && (
                <InfoRow label={translate('common.specialRequests')} value={customer.specialRequests} />
            )}
        </Card>
    );
};

const styles = StyleSheet.create({
    sectionTitle: { marginBottom: 12 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
});
