import React from 'react';
import { StyleSheet } from 'react-native';
import Container from '@components/global/container/Container';
import Card from '@components/global/card/Card';
import Typography from '@components/global/typography/Typography';
import { useTranslation } from '@i18n/useTranslation';

interface RecentSearchCardProps {
    from: string;
    to: string;
    day: string;
    dayBack?: string;
}

export const RecentSearchCard: React.FC<RecentSearchCardProps> = ({ from, to, day, dayBack }) => {
    const { translate } = useTranslation();

    return (
        <Card style={styles.card}>
            <Typography variant="h3" weight="bold">
                {from} → {to}
            </Typography>
            <Typography variant="body" style={{ marginTop: 4 }}>
                {translate('booking.travelDate')}: {day}
                {dayBack ? ` · ${translate('booking.roundTrip')}: ${dayBack}` : ''}
            </Typography>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
        padding: 16,
    },
});
