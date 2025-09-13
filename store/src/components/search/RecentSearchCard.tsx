import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Container from '@components/global/container/Container';
import Card from '@components/global/card/Card';
import Typography from '@components/global/typography/Typography';
import { useTranslation } from '@i18n/useTranslation';
import { formatDate } from '@utils/dateUtils';
import { getLocationLabel } from '@utils/prepareLocations';

interface RecentSearchCardProps {
    from: string;
    to: string;
    day: string;
    dayBack?: string;
}

export const RecentSearchCard: React.FC<RecentSearchCardProps> = ({ from, to, day, dayBack }) => {
    const { translate } = useTranslation();
    const [fromLabel, setFromLabel] = useState(from);
    const [toLabel, setToLabel] = useState(to);

    useEffect(() => {
        const fetchLabels = async () => {
            setFromLabel(await getLocationLabel(from));
            setToLabel(await getLocationLabel(to));
        };
        fetchLabels();
    }, [from, to]);

    return (
        <Card style={styles.card}>
            <Typography variant="h3" weight="bold">
                {fromLabel} → {toLabel}
            </Typography>
            <Typography variant="body" style={{ marginTop: 4 }}>
                {translate('booking.travelDate')}: {formatDate(day)}
                {dayBack ? ` · ${translate('booking.roundTrip')}: ${formatDate(dayBack)}` : ''}
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
