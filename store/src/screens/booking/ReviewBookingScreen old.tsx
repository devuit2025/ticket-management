import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookingStackParamList } from '@navigation/BookingNavigator';
import { useTheme } from '@context/ThemeContext';
import { useBooking } from '@context/BookingContext';
import { useTranslation } from '@i18n/useTranslation';
import Container from '@components/global/container/Container';
import Card from '@components/global/card/Card';
import Typography from '@components/global/typography/Typography';
import Icon from '@components/global/icon/Icon';

type Props = NativeStackScreenProps<BookingStackParamList, 'ReviewBooking'>;

export default function ReviewBookingScreen({ navigation }: Props) {
    const { theme } = useTheme();
    const { translate } = useTranslation();
    const { bookingData } = useBooking();

    // Mocked data – ideally pulled from bookingData
    const customer = {
        fullName: 'Example Name',
        phone: '0986522131',
        email: 'example@gmail.com',
        type: 'Adult', // Passenger type
        specialRequests: 'Extra luggage', // Optional
    };

    const destination = {
        from: 'Ho Chi Minh City (Mien Dong Station)',
        to: 'Da Nang (Central Station)',
        duration: '12h 30m', // Estimated duration
    };

    const busInfo = {
        operator: 'Happy Bus Co.',
        type: 'Limousine 34',
        licensePlate: '51A-12345',
        amenities: ['Wi-Fi', 'AC', 'Power Outlet'], // Optional
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

    const handlePayment = () => {
        navigation.navigate('Payment'); // Navigate to Payment screen
    };

    // Payment Methods
    const paymentMethods = [
        { id: 'card', label: 'Credit / Debit Card', icon: 'card' },
        { id: 'momo', label: 'Momo Wallet', icon: 'wallet' },
        { id: 'cod', label: 'Cash on Delivery', icon: 'cash' },
    ];
    const [selectedPayment, setSelectedPayment] = useState('card');

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                <Container style={{ marginTop: 15 }}>
                    {/* ===== Trip Details ===== */}
                    <Card style={{ marginBottom: 15 }}>
                        <Typography variant="h2" weight="bold" style={styles.sectionTitle}>
                            {translate('booking.busInformation')}
                        </Typography>

                        <InfoRow label="Operator" value={busInfo.operator} />
                        <InfoRow label="Bus Type" value={busInfo.type} />
                        <InfoRow label="License Plate" value={busInfo.licensePlate} />

                        {busInfo.amenities.length > 0 && (
                            <InfoRow label="Amenities" value={busInfo.amenities.join(', ')} />
                        )}

                        <InfoRow label="Total Seats" value={busInfo.totalSeats.toString()} />
                        {/* Improved Timing */}
                        <View style={styles.timingContainer}>
                            <View style={styles.timingColumn}>
                                <Typography variant="body" weight="medium" color="gray">
                                    Start
                                </Typography>
                                <Typography variant="body" weight="bold">
                                    {busInfo.startDay} {busInfo.startTime}
                                </Typography>
                            </View>
                            <View style={styles.timingColumn}>
                                <Typography variant="body" weight="medium" color="gray">
                                    End
                                </Typography>
                                <Typography variant="body" weight="bold">
                                    {busInfo.endDay} {busInfo.endTime}
                                </Typography>
                            </View>
                            <View style={styles.timingColumn}>
                                <Typography variant="body" weight="medium" color="gray">
                                    Duration
                                </Typography>
                                <Typography variant="body" weight="bold">
                                    {destination.duration}
                                </Typography>
                            </View>
                        </View>
                    </Card>
                    <Card style={{ marginBottom: 15 }}>
                        <Typography variant="h2" weight="bold" style={styles.sectionTitle}>
                            {translate('booking.destinationInformation')}
                        </Typography>
                        <InfoRow label="From" value={destination.from} />
                        <InfoRow label="To" value={destination.to} />
                    </Card>

                    <Card style={{ marginBottom: 15 }}>
                        <Typography variant="h2" weight="bold" style={styles.sectionTitle}>
                            {translate('booking.pickupDropoffInformation')}
                        </Typography>
                        <InfoRow label="Pick-up" value="123 Main Street, Ho Chi Minh" />
                        <InfoRow label="Drop-off" value="45 Central Road, Da Nang" />
                    </Card>

                    {/* ===== Passenger Details ===== */}
                    <Card style={{ marginBottom: 15 }}>
                        <Typography variant="h2" weight="bold" style={styles.sectionTitle}>
                            {translate('booking.passengerInfo')}
                        </Typography>
                        <InfoRow label="Full Name" value={customer.fullName} />
                        <InfoRow label="Phone" value={customer.phone} />
                        <InfoRow label="Email" value={customer.email} />
                        <InfoRow label="Passenger Type" value={customer.type} />
                    </Card>

                    {/* ===== Seats + Pricing ===== */}
                    <Card style={{ marginBottom: 15 }}>
                        <Typography variant="h2" weight="bold" style={styles.sectionTitle}>
                            {translate('booking.seatInformation')}
                        </Typography>

                        {/* Seat Selection */}
                        <View style={styles.seatContainer}>
                            {seats.map((seat, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.seatItem,
                                        { backgroundColor: theme.colors.primary },
                                    ]}
                                >
                                    <Typography variant="body" color="white" weight="bold">
                                        {seat}
                                    </Typography>
                                </View>
                            ))}
                        </View>

                        {/* Pricing */}
                        <View style={{ marginTop: 12 }}>
                            <InfoRow label="Price per Seat" value={busInfo.pricePerSeat} />
                            {fees.map((fee, index) => (
                                <InfoRow key={index} label={fee.label} value={fee.value} />
                            ))}
                            <InfoRow label="Total Price" value={busInfo.totalPrice} />
                        </View>
                    </Card>
                    <Card style={{ marginBottom: 15 }}>
                        <Typography variant="h2" weight="bold" style={styles.sectionTitle}>
                            {translate('booking.paymentMethod')}
                        </Typography>

                        {paymentMethods.map((method) => (
                            <TouchableOpacity
                                key={method.id}
                                style={[
                                    styles.paymentOption,
                                    selectedPayment === method.id && {
                                        borderColor: theme.colors.primary,
                                        borderWidth: 2,
                                    },
                                ]}
                                onPress={() => setSelectedPayment(method.id)}
                            >
                                <Icon
                                    name={method.icon}
                                    type="ion"
                                    size="md"
                                    color={theme.colors.primary}
                                />
                                <Typography
                                    variant="body"
                                    weight="medium"
                                    style={{ marginLeft: 8 }}
                                >
                                    {method.label}
                                </Typography>
                            </TouchableOpacity>
                        ))}
                    </Card>
                </Container>
            </ScrollView>

            {/* Bottom Payment Button */}
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

const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.row}>
        <Typography variant="body" weight="medium" color="gray">
            {label}
        </Typography>
        <Typography variant="body" weight="bold">
            {value}
        </Typography>
    </View>
);

const styles = StyleSheet.create({
    sectionTitle: {
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    seatContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    seatItem: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginRight: 8,
        marginBottom: 8,
    },
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
    timingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    timingColumn: {
        flex: 1,
        alignItems: 'center',
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 10,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
});
