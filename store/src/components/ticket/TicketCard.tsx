import React from 'react';
import { View, StyleSheet } from 'react-native';
import Card from '@components/global/card/Card';
import Typography from '@components/global/typography/Typography';

const BusTicketCard = () => {
    return (
        <Card style={styles.card}>
            {/* Header: Route Info */}
            <View style={styles.header}>
                <Typography variant="h2" weight="bold">
                    Ho Chi Minh → Da Nang
                </Typography>
                <Typography variant="caption" color="#888">
                    Departure: 18 Aug 2025, 8:00 PM
                </Typography>
            </View>

            {/* Divider */}
            <View style={styles.dashedLine} />

            {/* Passenger Info */}
            <View style={styles.section}>
                <Typography variant="body">Passenger: Nguyen Van A</Typography>
                <Typography variant="caption" color="#888" style={{ marginTop: 4 }}>
                    Seat: B12 · Payment: Momo
                </Typography>
            </View>

            {/* Divider */}
            <View style={styles.dashedLine} />

            {/* Footer / Ticket Code */}
            <View style={styles.footer}>
                <Typography variant="caption" weight="medium" color="#888">
                    Ticket Code: FT123456
                </Typography>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 3,
    },
    header: {
        marginBottom: 12,
    },
    section: {
        marginVertical: 12,
    },
    footer: {
        alignItems: 'center',
        marginTop: 12,
    },
    dashedLine: {
        borderBottomWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#ccc',
    },
});

export default BusTicketCard;
