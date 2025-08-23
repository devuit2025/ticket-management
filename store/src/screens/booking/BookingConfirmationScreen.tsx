import React, { useRef } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookingStackParamList } from '@navigation/BookingNavigator';
import { useTheme } from '@context/ThemeContext';
import { useBooking } from '@context/BookingContext';
import { useTranslation } from '@i18n/useTranslation';
import Container from '@components/global/container/Container';
import Typography from '@components/global/typography/Typography';
import QRCode from 'react-native-qrcode-svg';
import { BusInfoCard } from '@components/bus/BusInfoCard';
import { SeatPricingCard } from '@components/seat/SeatPricingCard';

import ViewShot from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { DestinationCard } from '@components/global/card/DestinationCard';
import { PickupDropoffCard } from '@components/global/card/PickupDropoffCard';
import { PassengerCard } from '@components/global/card/PassengerCard';

type Props = NativeStackScreenProps<BookingStackParamList, 'BookingConfirmation'>;

export default function BookingConfirmationScreen({ navigation }: Props) {
    const { theme } = useTheme();
    const { translate } = useTranslation();
    const { bookingData } = useBooking();
    const viewRef = useRef<any>(null);

    // Mocked data
    const customer = {
        fullName: 'Example Name',
        phone: '0986522131',
        email: 'example@gmail.com',
        type: 'Adult',
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
        bookingRef: 'ABC123456',
    };

    const seats = ['A02', 'A03', 'B01'];
    const fees = [
        { label: 'Service Fee', value: '50,000 VND' },
        { label: 'Discount', value: '-100,000 VND' },
    ];

    const handleBackHome = () => navigation.popToTop();

    const handleDownloadTicket = async () => {
        if (Platform.OS === 'web') {
            alert('Download not supported on web yet.');
            return;
        }
        if (viewRef.current) {
            const uri = await viewRef.current.capture();
            await Sharing.shareAsync(uri);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                <Container style={{ marginTop: 15 }}>
                    {/* Capture this entire container for download */}
                    <ViewShot ref={viewRef} options={{ format: 'png', quality: 1 }}>
                        {/* ===== Booking Success + QR Code ===== */}
                        <View style={styles.successContainer}>
                            <QRCode
                                value={busInfo.bookingRef}
                                size={150}
                                color={theme.colors.primary}
                            />
                            <Typography variant="h1" weight="bold" style={{ marginTop: 12 }}>
                                {translate('booking.bookingSuccess')}
                            </Typography>
                            <Typography
                                variant="body"
                                color="gray"
                                style={{ textAlign: 'center', marginTop: 8 }}
                            >
                                {translate('booking.bookingSuccessMessage')}
                            </Typography>
                        </View>

                        {/* ===== Booking Details ===== */}
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
                    </ViewShot>

                    {/* Download Ticket Button */}
                    {/* <TouchableOpacity
                        style={[styles.downloadButton, { backgroundColor: theme.colors.primary }]}
                        onPress={handleDownloadTicket}
                    >
                        <Typography variant="h3" color="white" weight="bold">
              {translate('booking.downloadTicket')}
            </Typography>
                    </TouchableOpacity> */}
                </Container>
            </ScrollView>

            {/* Bottom Button */}
            <View style={[styles.bottomBar, { backgroundColor: theme.colors.card }]}>
                <TouchableOpacity
                    style={[styles.backButton, { backgroundColor: theme.colors.primary }]}
                    onPress={handleBackHome}
                >
                    <Typography variant="h2" color="white" weight="bold">
                        {translate('booking.backToHome')}
                    </Typography>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    successContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    downloadButton: {
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
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
    backButton: {
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
});
