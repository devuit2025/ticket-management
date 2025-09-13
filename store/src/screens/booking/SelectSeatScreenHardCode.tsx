import Card from '@components/global/card/Card';
import Container from '@components/global/container/Container';
import BusSeatSelector from '@components/seat/BusSeatSelector';
import { useBooking } from '@context/BookingContext';
import { useTheme } from '@context/ThemeContext';
import { BookingStackParamList } from '@navigation/BookingNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type Props = NativeStackScreenProps<BookingStackParamList, 'SelectSeat'>;

const SelectSeatScreen = ({ navigation }: Props) => {
    const { bookingData, setBookingData } = useBooking();
    const { theme } = useTheme();
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

    const tripId = bookingData.daySelectedTrip.id;

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

    const handleSelected = (selected: string[]) => {
        setSelectedSeats(selected);
        console.log(selected);
    };

    const handleReviewBooking = () => {
        console.log('heere');
        navigation.navigate('ReviewBooking');
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Container>
                <Card>
                    <BusSeatSelector
                        startDate="2025-08-20"
                        timeInfo="Wed, 14:30"
                        layout="2-1-2"
                        seatMap={seatMap}
                        onSelect={handleSelected}
                    />
                </Card>
            </Container>

            {/* Bottom Fixed Bar */}
            <View style={[styles.bottomBar, { backgroundColor: 'theme.colors.card' }]}>
                <View>
                    <Text style={[styles.seatText, { color: theme.colors.text }]}>
                        {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} selected
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.colors.primary }]}
                    onPress={handleReviewBooking}
                    disabled={selectedSeats.length === 0}
                >
                    <Text style={styles.buttonText}>Review Booking</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    bottomBar: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 20,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 6,
    },
    seatText: {
        fontSize: 16,
        fontWeight: '500',
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
    },
    buttonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
});

export default SelectSeatScreen;
