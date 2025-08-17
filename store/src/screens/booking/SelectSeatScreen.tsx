import Card from '@components/global/card/Card';
import Container from '@components/global/container/Container';
import BusSeatSelector from '@components/seat/BusSeatSelector';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SelectSeatScreen = () => {
    const seatMap = {
        A01: 'booked',
        A02: 'available',
        A03: 'available',
        A04: 'booked',
        A05: 'available',
        B01: 'available',
        B02: 'available',
        B03: 'available',
        B04: 'available',
        B05: 'booked',
        C01: 'available',
        C02: 'available',
        C03: 'available',
        C04: 'available',
        C05: 'available',
    };
    return (
        <View style={styles.container}>
            <Container>
                <Card>
                    <BusSeatSelector
                        startDate="2025-08-20"
                        timeInfo="Wed, 14:30"
                        layout="2-1-2"
                        seatMap={seatMap}
                        onSelect={(selected) => console.log('Selected seats:', selected)}
                    />
                </Card>
            </Container>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
});

export default SelectSeatScreen;
