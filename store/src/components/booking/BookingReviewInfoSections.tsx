import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookingStackParamList } from '@navigation/BookingNavigator';
import { useTheme } from '@context/ThemeContext';
import { useBooking } from '@context/BookingContext';
import { useTranslation } from '@i18n/useTranslation';
import Typography from '@components/global/typography/Typography';
import { BusInfoCard } from '@components/bus/BusInfoCard';
import { SeatPricingCard } from '@components/seat/SeatPricingCard';
import { DestinationCard } from '@components/global/card/DestinationCard';
import { PassengerCard } from '@components/global/card/PassengerCard';
import dayjs from 'dayjs';
import { useAuth } from '@hooks/useAuth';

export default function BookingReviewInfoSections({ navigation }) {
    const { theme } = useTheme();
    const { translate } = useTranslation();
    const { bookingData } = useBooking();

    if (!bookingData || !bookingData.daySelectedTrip) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="h2">No booking data available</Typography>
            </View>
        );
    }

    const [passenger, setPassenger] = useState<null | {
        fullName: string;
        phone: string;
        email: string;
        type: string;
    }>(null);

    const { getCurrentUser } = useAuth();

    // Get the current user from Redux
    // Load currentUser from AsyncStorage when component mounts
    useEffect(() => {
        const fetchUser = async () => {
            const user = await getCurrentUser();
            if (user) {
                setPassenger({
                    fullName: user.name,
                    phone: user.phone,
                    email: user.email,
                    type: 'Adult', // you can modify based on bookingData
                });
            }
        };
        fetchUser();
    }, []);

    // Map bookingData to component props
    const trip = bookingData.daySelectedTrip;
    const route = trip.route;
    const bus = trip.bus;
    const driver = trip.driver;

    const destination = {
        from: route.origin,
        to: route.destination,
        duration: route.duration,
    };

    // Parse duration like "3h30m" into minutes
    const parseDurationToMinutes = (str: string) => {
        const match = str.match(/(?:(\d+)h)?(?:(\d+)m)?/);
        if (!match) return 0;
        const hours = parseInt(match[1] || '0', 10);
        const minutes = parseInt(match[2] || '0', 10);
        return hours * 60 + minutes;
    };

    const departure = dayjs(trip.departure_time);
    const tripDurationMinutes = parseDurationToMinutes(route.duration);
    const arrival = departure.add(tripDurationMinutes, 'minute');

    const busInfo = {
        operator: driver.name || 'N/A',
        type: bus.type,
        licensePlate: bus.plate_number,
        amenities: ['Wi-Fi', 'AC'], // Replace with real amenities
        startDay: departure.format('YYYY-MM-DD'),
        startTime: departure.format('HH:mm'),
        endDay: arrival.format('YYYY-MM-DD'),
        endTime: arrival.format('HH:mm'),
        totalSeats: bus.seat_count,
        pricePerSeat: `${trip.price.toLocaleString()} VND`,
        totalPrice: `${(trip.price * bookingData.selectedSeats.length).toLocaleString()} VND`,
    };

    const seats = bookingData.selectedSeats;
    const fees = [{ label: 'Service Fee', value: '0 VND' }];

    return (
        <>
            <BusInfoCard busInfo={busInfo} duration={destination.duration} />
            <DestinationCard from={destination.from} to={destination.to} />
            {/* <PickupDropoffCard pickup={pickup} dropoff={dropoff} /> */}
            {/* {passengers.map((p, index) => (
                <PassengerCard key={index} customer={p} />
            ))} */}
            {passenger && <PassengerCard customer={passenger} />}

            <SeatPricingCard
                seats={seats}
                pricePerSeat={busInfo.pricePerSeat}
                fees={fees}
                totalPrice={busInfo.totalPrice}
                primaryColor={theme.colors.primary}
            />
        </>
    );
}
