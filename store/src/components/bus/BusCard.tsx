import React from 'react';
import { View, StyleSheet } from 'react-native';
import Button from '@components/global/button/Button';
import Card from '@components/global/card/Card';

import Typography from '@components/global/typography/Typography';

interface BusCardProps {
    startTime: string;
    endTime: string;
    price: string;
    carType: string;
    availableSeats: number;
    startLocation: string;
    endLocation: string;
    onSelect?: () => void;
}

const BusCard: React.FC<BusCardProps> = ({
    startTime,
    endTime,
    price,
    carType,
    availableSeats,
    startLocation,
    endLocation,
    onSelect,
}) => {
    return (
        <Card style={styles.card}>
            {/* Header: Time + Price */}
            <View style={styles.headerRow}>
                <Typography variant="h2" weight="bold" style={styles.time}>
                    {startTime} → {endTime}
                </Typography>
                <Typography variant="h3" weight="bold" style={styles.price}>
                    {price}
                </Typography>
            </View>

            {/* Sub info: Car type + Seats */}
            <View style={styles.subInfo}>
                <Typography variant="body" color="#555">
                    {carType}
                </Typography>
                <Typography variant="body" color={availableSeats > 3 ? '#2E7D32' : '#D32F2F'}>
                    {availableSeats} seats left
                </Typography>
            </View>

            {/* Divider (ticket-like) */}
            <View style={styles.dashedDivider} />

            {/* Route + Button */}
            <View style={styles.routeRow}>
                <View style={styles.route}>
                    <Typography variant="body" weight="medium">
                        {startLocation}
                    </Typography>
                    <View style={styles.line} />
                    <Typography variant="body" weight="medium">
                        {endLocation}
                    </Typography>
                </View>

                {/* Select button */}
                {/* <Button style={styles.button} onPress={onSelect}>
        </Button> */}
                <Button title="Select Seat" onPress={onSelect} />
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 16,
        borderRadius: 20,
        backgroundColor: '#fff',
        marginBottom: 20,
        borderWidth: 1,
        borderStyle: 'dashed', // ticket-like border
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 3,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    time: {
        color: '#FF5722', // highlight time
    },
    price: {
        color: '#2E7D32', // green = money
    },
    subInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    dashedDivider: {
        borderBottomWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#ccc',
        marginVertical: 12,
    },
    routeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    route: {
        flexDirection: 'column',
        flex: 1,
    },
    line: {
        height: 24,
        borderLeftWidth: 2,
        borderColor: '#aaa',
        marginVertical: 4,
        marginLeft: 4,
    },
    button: {
        marginLeft: 16,
        backgroundColor: '#FF5722',
        borderRadius: 14,
        paddingHorizontal: 18,
        paddingVertical: 10,
    },
});

export default BusCard;
