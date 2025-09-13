import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookingStackParamList } from '@navigation/BookingNavigator';
import { useTheme } from '@context/ThemeContext';
import { useBooking } from '@context/BookingContext';
import { useTranslation } from '@i18n/useTranslation';
import Container from '@components/global/container/Container';
import Typography from '@components/global/typography/Typography';
import { PaymentMethodCard } from '@components/payment/PaymentMethodCard';
import BookingReviewInfoSections from '@components/booking/BookingReviewInfoSections';
import { GuestInfo } from '@api/bookings';
import { useAuth } from '@hooks/useAuth';

type Props = NativeStackScreenProps<BookingStackParamList, 'ReviewBooking'>;

export default function ReviewBookingScreen({ navigation }: Props) {
    const { theme } = useTheme();
    const { translate } = useTranslation();
    const { bookingData, createBooking } = useBooking();

    const [guestInfo, setGuestInfo] = useState<GuestInfo | undefined>(undefined);
    const { getCurrentUser } = useAuth();
    // Load current user info on mount
    useEffect(() => {
        const fetchUser = async () => {
            const user = await getCurrentUser();
            if (user) {
                setGuestInfo({
                    name: user.name,
                    phone: user.phone,
                    id: user.id,
                });
            }
        };
        fetchUser();
    }, []);

    if (!bookingData || !bookingData.daySelectedTrip) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="h2">No booking data available</Typography>
            </View>
        );
    }

    const paymentMethods = [
        // { id: 'card', label: 'Credit / Debit Card', icon: 'card' },
        // { id: 'momo', label: 'Momo Wallet', icon: 'wallet' },
        // { id: 'cod', label: 'Cash on Delivery', icon: 'cash' },
        { id: 'counter', label: 'Pay at Counter', icon: 'cash' },
    ];

    const [selectedPayment, setSelectedPayment] = useState('counter');

    const handlePayment = async () => {
        /** Handle payment */
        try {
            // If guestInfo is set from current user, it will be passed
            const response = await createBooking(guestInfo, 'Booking via app');
            console.log(response);
            navigation.navigate('BookingConfirmation');
        } catch (error: any) {
            console.error('Booking failed:', error);
        } finally {
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                <Container style={{ marginTop: 15 }}>
                    <BookingReviewInfoSections></BookingReviewInfoSections>

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
