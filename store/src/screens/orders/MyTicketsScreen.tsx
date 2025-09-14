import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@context/ThemeContext';
import { useTranslation } from '@i18n/useTranslation';
import Container from '@components/global/container/Container';
import Card from '@components/global/card/Card';
import Typography from '@components/global/typography/Typography';
import { format } from 'date-fns';
import { getUserBookings } from '@api/bookings'; // your client function
import { getRoute } from '@api/routes';

export default function BookingHistoryScreen({ navigation }) {
    const { theme } = useTheme();
    const { translate } = useTranslation();

    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await getUserBookings(1, 10);

                // Map bookings with route info
                const formattedBookings = await Promise.all(
                    res.bookings.map(async (b) => {
                        let from = 'Unknown';
                        let to = 'Unknown';

                        // Fetch route info if trip exists
                        if (b.trip?.route_id) {
                            try {
                                const routeRes = await getRoute(b.trip.route_id);
                                from = routeRes.origin || 'Unknown';
                                to = routeRes.destination || 'Unknown';
                            } catch (err) {
                                console.error('Failed to fetch route', err);
                            }
                        }

                        return {
                            id: b.booking_code,
                            from,
                            to,
                            date: new Date(b.trip?.departure_time),
                            time: new Date(b.trip?.departure_time),
                            status: b.status,
                            totalPrice: `${b.total_amount.toLocaleString()} VND`,
                        };
                    })
                );

                setBookings(formattedBookings);
            } catch (err: any) {
                console.error(err);
                setError('Failed to load bookings');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="body" color="error">
                    {error}
                </Typography>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                <Container style={{ marginTop: 15 }}>
                    {bookings.map((booking) => (
                        <TouchableOpacity
                            key={booking.id}
                            onPress={() =>
                                navigation.navigate('Booking', {
                                    screen: 'BookingConfirmation',
                                    params: {
                                        bookingId: booking.id,
                                    }
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
                                            {format(new Date(booking.date), 'HH:mm')}
                                        </Typography>
                                    </View>
                                    {/* <Typography
                                        variant="body"
                                        weight="bold"
                                        color={
                                            booking.status === 'success'
                                                ? theme.colors.success
                                                : theme.colors.error
                                        }
                                    >
                                        {translate(
                                            `booking.status.${booking.status.toLowerCase()}`
                                        )}
                                    </Typography> */}
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
