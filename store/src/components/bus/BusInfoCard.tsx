// BusInfoCard.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Card from '@components/global/card/Card';
import Typography from '@components/global/typography/Typography';
import { InfoRow } from '@components/global/typography/InfoRow';
import { useTranslation } from '@i18n/useTranslation';

export const BusInfoCard = ({ busInfo, duration }) => {
    const { translate } = useTranslation();
    
    return (
        <Card style={{ marginBottom: 15 }}>
            <Typography variant="h2" weight="bold" style={styles.sectionTitle}>
                Bus Information
            </Typography>
            <InfoRow label={translate('common.operator')} value={busInfo.operator} />
            <InfoRow label={translate('common.busType')} value={busInfo.type} />
            <InfoRow label={translate('common.licensePlate')} value={busInfo.licensePlate} />
            {busInfo.amenities?.length > 0 && (
                <InfoRow label={translate('common.amenities')} value={busInfo.amenities.join(', ')} />
            )}
            <InfoRow label={translate('common.totalSeats')} value={busInfo.totalSeats.toString()} />
            <InfoRow label={translate('common.day')} value={busInfo.startDay} />

            {/* Timing */}
            <View style={styles.timingContainer}>
                <View style={styles.timingColumn}>
                    <Typography variant="body" weight="medium" color="gray">
                        Start
                    </Typography>
                    <Typography variant="body" weight="bold">
                        {busInfo.startTime}
                    </Typography>
                </View>
                <View style={styles.timingColumn}>
                    <Typography variant="body" weight="medium" color="gray">
                        End
                    </Typography>
                    <Typography variant="body" weight="bold">
                        {busInfo.endTime}
                    </Typography>
                </View>
                <View style={styles.timingColumn}>
                    <Typography variant="body" weight="medium" color="gray">
                        Duration
                    </Typography>
                    <Typography variant="body" weight="bold">
                        {duration}
                    </Typography>
                </View>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    sectionTitle: { marginBottom: 12 },
    timingContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
    timingColumn: { flex: 1, alignItems: 'center' },
});
