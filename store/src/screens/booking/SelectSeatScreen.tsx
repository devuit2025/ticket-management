import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Card from '@components/global/card/Card';
import Container from '@components/global/container/Container';
import BusSeatSelector from '@components/seat/BusSeatSelector';
import { useBooking } from '@context/BookingContext';
import { useTheme } from '@context/ThemeContext';
import { BookingStackParamList } from '@navigation/BookingNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getTripSeats, GetTripSeatsResponse } from '@api/trips';
import { useTranslation } from '@i18n/useTranslation';

type Props = NativeStackScreenProps<BookingStackParamList, 'SelectSeat'>;

type SeatStatus = 'available' | 'booked' | 'locked';

const SelectSeatScreen = ({ navigation }: Props) => {
    const { bookingData, setBookingData } = useBooking();
    const { translate } = useTranslation()
    const { theme } = useTheme();
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [seatMap, setSeatMap] = useState<Record<string, SeatStatus>>({});
    const [seatNumberToId, setSeatNumberToId] = useState<Record<string, number>>({}); // map seat number -> seat ID

    const tripId = bookingData?.daySelectedTrip?.id;

    useEffect(() => {
        const fetchSeats = async () => {
            try {
                if (!tripId) {
                    return;
                }
                const data: GetTripSeatsResponse = await getTripSeats(tripId);
                const numberToId: Record<string, number> = {};

                // Transform API response into seatMap
                const map: Record<string, SeatStatus> = {};
                data.floors.forEach((floor) => {
                    floor.seats.forEach((seat) => {
                        map[seat.number] = seat.status as SeatStatus;
                        numberToId[seat.number] = seat.ID; // store seat ID mapping
                    });
                });

                setSeatMap(map);
                setSeatNumberToId(numberToId);
            } catch (error) {
                console.error('Failed to fetch seats:', error);
            }
        };

        fetchSeats();
    }, [tripId]);

    const handleSelected = (selected: string[]) => {
        setSelectedSeats(selected);

        const ids = selected.map((seatNumber) => seatNumberToId[seatNumber]).filter(Boolean);
        setBookingData((prev) => ({ ...prev, daySelectedSeatIds: ids }));
    };

    const handleReviewBooking = () => {
        setBookingData((prev) => ({ ...prev, selectedSeats }));
        navigation.navigate('ReviewBooking');
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Container>
                <Card>
                    <BusSeatSelector
                        startDate="2025-08-20"
                        timeInfo="Wed, 14:30"
                        layout="2-2"
                        seatMap={seatMap}
                        onSelect={handleSelected}
                    />
                </Card>
            </Container>

            {/* Bottom Fixed Bar */}
            <View style={[styles.bottomBar, { backgroundColor: theme.colors.card }]}>
                <View>
                    <Text style={[styles.seatText, { color: theme.colors.text }]}>
                        {selectedSeats.length} {translate('booking.seat')}{selectedSeats.length !== 1 ? '' : ''} {translate('booking.selected')}
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.colors.primary }]}
                    onPress={handleReviewBooking}
                    disabled={selectedSeats.length === 0}
                >
                    <Text style={styles.buttonText}>{translate('booking.reviewBooking')}</Text>
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
