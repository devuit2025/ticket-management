import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { useTheme } from '@context/ThemeContext';
import { useTranslation } from '@i18n/useTranslation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookingStackParamList } from '@navigation/BookingNavigator';
import Container from '@components/global/container/Container';
import Typography from '@components/global/typography/Typography';
import FilterCard from '@components/search/FilterCard';
import BusList from '@components/bus/BusList';
import SpinnerLoader from '@components/global/loader/SpinnerLoader';
import { useBooking } from '@context/BookingContext';

type Props = NativeStackScreenProps<BookingStackParamList, 'SelectBus'>;

export default function SelectBusScreen({ navigation }: Props) {
    const { bookingData, setBookingData, trips, loading, fetchTripsForDay } = useBooking();
    const { theme } = useTheme();
    const { translate } = useTranslation();
    // console.log(bookingData)
    const [selectedDate, setSelectedDate] = useState(bookingData.day);

    // Sync local selectedDate with bookingData.day
    useEffect(() => {
        setBookingData((prev) => ({ ...prev, day: selectedDate }));
    }, [selectedDate]);

    // Initial fetch + reactive fetch whenever routeId or day changes
    useEffect(() => {
        // console.log('here')
        console.log('Fetch trips for routeId, Day: ', bookingData.routeId, bookingData.day)
        if (!bookingData.routeId || !bookingData.day) return;

        let isMounted = true; // to prevent state update if component unmounted

        const fetchTrips = async () => {
            await fetchTripsForDay(); // context handles loading internally
        };

        if (isMounted) fetchTrips();

        return () => {
            isMounted = false;
        };
    }, [bookingData.routeId, bookingData.day]);

    const goToSeatSelect = (trip) => {
        setBookingData((prev) => ({ ...prev, daySelectedTrip: trip }));
        navigation.navigate('SelectSeat');
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
            >
                <Container style={{ marginTop: 15 }}>
                    {/* Filter */}
                    <FilterCard
                        selectedDate={selectedDate}
                        onDateChange={setSelectedDate}
                        // filters={[
                        //     { label: 'Fruit', options: [{ label: 'Apple', value: 'apple' }, { label: 'Banana', value: 'banana' }] },
                        //     { label: 'Color', options: [{ label: 'Red', value: 'red' }, { label: 'Blue', value: 'blue' }] },
                        //     { label: 'Animal', options: [{ label: 'Cat', value: 'cat' }, { label: 'Dog', value: 'dog' }] },
                        // ]}
                        onFiltersChange={(selected) => console.log(selected)}
                    />

                    {/* Title */}
                    <Typography
                        variant="h2"
                        color="black"
                        weight="bold"
                        style={{ marginBottom: 10 }}
                    >
                        Search result
                    </Typography>

                    {/* Loader or BusList */}
                    {loading ? (
                        <SpinnerLoader size="large" />
                    ) : (
                        <BusList onSelectBus={goToSeatSelect} data={trips} />
                    )}
                </Container>
            </ScrollView>
        </View>
    );
}
