// SeatPricingCard.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Card from '@components/global/card/Card';
import Typography from '@components/global/typography/Typography';
import { InfoRow } from '@components/global/typography/InfoRow';

export const SeatPricingCard = ({ seats, pricePerSeat, fees, totalPrice, primaryColor }) => (
    <Card style={{ marginBottom: 15 }}>
        <Typography variant="h2" weight="bold" style={styles.sectionTitle}>
            Seats & Pricing
        </Typography>
        <View style={styles.seatContainer}>
            {seats.map((seat, index) => (
                <View key={index} style={[styles.seatItem, { backgroundColor: primaryColor }]}>
                    <Typography variant="body" color="white" weight="bold">
                        {seat}
                    </Typography>
                </View>
            ))}
        </View>
        <View style={{ marginTop: 12 }}>
            <InfoRow label="Price per Seat" value={pricePerSeat} />
            {fees.map((fee, i) => (
                <InfoRow key={i} label={fee.label} value={fee.value} />
            ))}
            <InfoRow label="Total Price" value={totalPrice} />
        </View>
    </Card>
);

const styles = StyleSheet.create({
    sectionTitle: { marginBottom: 12 },
    seatContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    seatItem: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginRight: 8,
        marginBottom: 8,
    },
});
