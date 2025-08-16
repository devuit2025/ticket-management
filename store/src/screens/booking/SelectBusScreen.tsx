import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useBooking } from '@context/BookingContext';
import { useTheme } from '@context/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookingStackParamList } from '@navigation/BookingNavigator';
import Container from '@components/global/container/Container';
import Card from '@components/global/card/Card';
import HorizontalDateSelector from '@components/date/HorizontalDateSelector';

type Props = NativeStackScreenProps<BookingStackParamList, 'SelectBus'>;

interface Bus {
    id: string;
    name: string;
    departureTimes: string[];
    price: number;
    seatType: 'limousin' | 'bed' | 'normal';
    totalSeats: number;
    availableSeats: number;
    fromStation: string;
    toStation: string;
}
const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
});
export default function SelectBusScreen({ navigation }: Props) {
    const { bookingData, setBookingData } = useBooking();
    const { theme } = useTheme();
    const [filter, setFilter] = useState({
        day: bookingData.day, // can be adjusted inside component
        priceRange: [0, 500], // min-max
        seatType: null as 'limousin' | 'bed' | 'normal' | null,
        timeRange: ['00:00', '23:59'], // start-end
    });

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Container style={{ marginTop: 15 }}>
                <Card>
                    <HorizontalDateSelector
                        recentDate={bookingData.day ? new Date(bookingData.day) : new Date()}
                        selectedDate={filter.day ? new Date(filter.day) : null}
                        onSelect={(date) => setFilter((prev) => ({ ...prev, day: date }))}
                    />
                    {/* <HorizontalDateSelector
                
                dates={weekDates}
                selectedDate={filter.day ? new Date(filter.day) : null}
                onSelect={date => setFilter(prev => ({ ...prev, day: date }))}
                /> */}
                </Card>
            </Container>
        </View>
    );
}
