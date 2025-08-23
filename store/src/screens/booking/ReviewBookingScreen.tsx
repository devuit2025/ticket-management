import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookingStackParamList } from '@navigation/BookingNavigator';
import { useTheme } from '@context/ThemeContext';
import { useBooking } from '@context/BookingContext';
import { useTranslation } from '@i18n/useTranslation';
import Container from '@components/global/container/Container';
import Typography from '@components/global/typography/Typography';
import { BusInfoCard } from '@components/bus/BusInfoCard';
import { SeatPricingCard } from '@components/seat/SeatPricingCard';
import { PaymentMethodCard } from '@components/payment/PaymentMethodCard';
import { DestinationCard } from '@components/global/card/DestinationCard';
import { PickupDropoffCard } from '@components/global/card/PickupDropoffCard';
import { PassengerCard } from '@components/global/card/PassengerCard';

type Props = NativeStackScreenProps<BookingStackParamList, 'ReviewBooking'>;

export default function ReviewBookingScreen({ navigation }: Props) {
    const { theme } = useTheme();
    const { translate } = useTranslation();
    const { bookingData } = useBooking();

    // Mocked data
    const customer = {
        fullName: 'Example Name',
        phone: '0986522131',
        email: 'example@gmail.com',
        type: 'Adult',
        specialRequests: 'Extra luggage',
    };
    const destination = {
        from: 'Ho Chi Minh City (Mien Dong Station)',
        to: 'Da Nang (Central Station)',
        duration: '12h 30m',
    };
    const busInfo = {
        operator: 'Happy Bus Co.',
        type: 'Limousine 34',
        licensePlate: '51A-12345',
        amenities: ['Wi-Fi', 'AC', 'Power Outlet'],
        startDay: '2025-08-20',
        startTime: '14:30',
        endDay: '2025-08-21',
        endTime: '06:00',
        totalSeats: 34,
        pricePerSeat: '350,000 VND',
        totalPrice: '1,050,000 VND',
    };
    const seats = ['A02', 'A03', 'B01'];
    const fees = [
        { label: 'Service Fee', value: '50,000 VND' },
        { label: 'Discount', value: '-100,000 VND' },
    ];

    const paymentMethods = [
        { id: 'card', label: 'Credit / Debit Card', icon: 'card' },
        { id: 'momo', label: 'Momo Wallet', icon: 'wallet' },
        { id: 'cod', label: 'Cash on Delivery', icon: 'cash' },
    ];
    const [selectedPayment, setSelectedPayment] = useState('card');

    const handlePayment = () => navigation.navigate('Payment');

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                <Container style={{ marginTop: 15 }}>
                    <BusInfoCard busInfo={busInfo} duration={destination.duration} />
                    <DestinationCard from={destination.from} to={destination.to} />
                    <PickupDropoffCard
                        pickup="123 Main Street, HCM"
                        dropoff="45 Central Rd, Da Nang"
                    />
                    <PassengerCard customer={customer} />
                    <SeatPricingCard
                        seats={seats}
                        pricePerSeat={busInfo.pricePerSeat}
                        fees={fees}
                        totalPrice={busInfo.totalPrice}
                        primaryColor={theme.colors.primary}
                    />
                    <PaymentMethodCard
                        paymentMethods={paymentMethods}
                        selectedPayment={selectedPayment}
                        setSelectedPayment={setSelectedPayment}
                        primaryColor={theme.colors.primary}
                    />
                </Container>
            </ScrollView>

            <View style={[styles.bottomBar, { backgroundColor: theme.colors.card }]}>
                <TouchableOpacity
                    style={[styles.paymentButton, { backgroundColor: theme.colors.primary }]}
                    onPress={handlePayment}
                >
                    <Typography variant="h2" color="white" weight="bold">
                        {translate('booking.paymentButton')}
                    </Typography>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
    },
    paymentButton: {
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
});
