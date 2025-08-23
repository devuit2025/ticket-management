import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookingStackParamList } from '@navigation/BookingNavigator';
import { useTheme } from '@context/ThemeContext';
import { useTranslation } from '@i18n/useTranslation';
import Container from '@components/global/container/Container';
import Card from '@components/global/card/Card';
import Typography from '@components/global/typography/Typography';
import Icon from '@components/global/icon/Icon';
import { format } from 'date-fns';

// type Props = NativeStackScreenProps<BookingStackParamList, 'BookingHistory'>;

export default function BookingHistoryScreen({ navigation }) {
    const { theme } = useTheme();
    const { translate } = useTranslation();

    // Mock data - replace with API data
    const bookings = [
        {
            id: 'BK001',
            from: 'Ho Chi Minh City',
            to: 'Da Nang',
            date: '2025-08-20',
            time: '14:30',
            status: 'Success',
            totalPrice: '1,050,000 VND',
        },
        {
            id: 'BK002',
            from: 'Hanoi',
            to: 'Hue',
            date: '2025-08-18',
            time: '09:00',
            status: 'Cancelled',
            totalPrice: '700,000 VND',
        },
    ];

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                <Container style={{ marginTop: 15 }}>
                    {bookings.map((booking) => (
                        <TouchableOpacity
                            key={booking.id}
                            onPress={() =>
                                navigation.navigate('BookingConfirmation', {
                                    bookingId: booking.id,
                                })
                            }
                        >
                            <Card style={styles.card}>
                                <View style={styles.row}>
                                    <View>
                                        <Typography variant="h3" weight="bold">
                                            {booking.from} → {booking.to}
                                        </Typography>
                                        <Typography variant="body" color="gray">
                                            {format(new Date(booking.date), 'dd/MM/yyyy')} at{' '}
                                            {booking.time}
                                        </Typography>
                                    </View>
                                    <Typography
                                        variant="body"
                                        weight="bold"
                                        color={
                                            booking.status === 'Success'
                                                ? theme.colors.success
                                                : theme.colors.error
                                        }
                                    >
                                        {translate(
                                            `booking.status.${booking.status.toLowerCase()}`
                                        )}
                                    </Typography>
                                </View>
                                <View style={{ marginTop: 8 }}>
                                    <Typography variant="body" weight="medium">
                                        {translate('booking.totalPrice')}: {booking.totalPrice}
                                    </Typography>
                                </View>
                            </Card>
                        </TouchableOpacity>
                    ))}
                </Container>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 15,
        padding: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
