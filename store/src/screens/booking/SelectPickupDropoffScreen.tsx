import React, { useEffect, useState } from 'react';
import { FormSelect } from '@components/form/FormSelect';
import { FormDatePicker } from '@components/form/FormDatePicker';
import { FormSubmitButton } from '@components/form/FormSubmitButton';
import { useBooking } from '@context/BookingContext';
import type { BookingData } from '@types';
import { useForm } from 'react-hook-form';
import { useTranslation } from '@i18n/useTranslation';
import Card from '@components/global/card/Card';
import Typography from '@components/global/typography/Typography';
import { ScrollView, StyleSheet, View } from 'react-native';
import Gap from '@components/global/gap/Gap';
import { useTheme } from '@context/ThemeContext';
import Container from '@components/global/container/Container';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { RecentSearchList } from '@components/search/RecentSearchList';
import { prepareLocations, Options } from '@utils/prepareLocations';

interface SelectPickupDropoffScreenProps {
    navigation: NavigationProp<Record<string, object | undefined>>;
    route: RouteProp<Record<string, object | undefined>, string>;
}

export default function SelectPickupDropoffScreen({
    navigation,
    route,
}: SelectPickupDropoffScreenProps) {
    const { translate } = useTranslation();
    const { theme } = useTheme();

    const [locations, setLocations] = useState<Options[]>([]);

    useEffect(() => {
        const fetchLocations = async () => {
            const result = await prepareLocations();
            setLocations(result);
        };

        fetchLocations();
    }, []);

    const { bookingData, setBookingData } = useBooking();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            numberOfTickets: '1',
        },
    });

    const handleChange = (field: keyof BookingData, value: string | Date | null) => {
        setBookingData((prev: BookingData) => ({
            ...prev,
            [field]: value,
        }));
    };

    const recentSearches = [
        {
            from: 'Saigon',
            to: 'Da Lat',
            day: '2025-08-20',
            dayBack: '2025-08-25',
        },
        {
            from: 'Hanoi',
            to: 'Ha Long',
            day: '2025-09-10',
        },
    ];

    const handleSearchBus = () => {
        console.log('search bus', bookingData);
        navigation.navigate('Booking');
    };

    return (
        <View style={{ flex: 1 }}>
            {/* Overlay */}
            <View
                style={{
                    position: 'absolute', // sit above the parent View
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0, // fill the parent
                    backgroundColor: theme.colors.primary, // semi-transparent overlay
                    zIndex: -1, // ensure it's above the background View
                }}
            />
            <ScrollView
                style={[
                    {
                        paddingTop: 80,
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    },
                ]}
            >
                <Container
                    style={{
                        zIndex: 2,
                    }}
                >
                    <View
                        style={{
                            marginBottom: 15,
                        }}
                    >
                        <Typography
                            variant="h1"
                            weight="bold"
                            color={theme.colors.onPrimary}
                            style={{ marginBottom: 0 }}
                        >
                            Welcome to Phuong Trang Tickets
                        </Typography>
                        <Typography variant="body" color={theme.colors.onPrimary}>
                            Tell us where you go and when
                        </Typography>
                    </View>
                    <Card>
                        <FormSelect
                            name="from"
                            control={control}
                            label={translate('booking.pickupLocation')}
                            placeholder={translate('booking.pickupLocationPlaceholder')}
                            options={locations}
                            value={bookingData.from}
                            onChange={(val: string) => handleChange('from', val)}
                            error={errors.from?.message}
                            textAlign="left"
                            iconName="location-outline"
                        />

                        <FormSelect
                            name="to"
                            control={control}
                            label={translate('booking.dropoffLocation')}
                            placeholder={translate('booking.dropoffLocationPlaceholder')}
                            options={locations}
                            value={bookingData.to}
                            onChange={(val: string) => handleChange('to', val)}
                            error={errors.to?.message}
                            textAlign="left"
                            iconName="location-outline"
                        />

                        <FormDatePicker
                            name="day"
                            control={control}
                            label={translate('booking.travelDate')}
                            placeholder={translate('booking.travelDatePlaceholder')}
                            value={bookingData.day}
                            onChange={(val: string) => handleChange('day', val)}
                            error={errors.day?.message}
                            textAlign="left"
                            iconName="calendar-outline"
                        />

                        <FormDatePicker
                            name="dayBack"
                            control={control}
                            label={
                                translate('booking.travelDate') +
                                ' ' +
                                translate('booking.roundTrip')
                            }
                            placeholder={translate('booking.travelDatePlaceholder')}
                            value={bookingData.dayBack}
                            onChange={(val: string) => handleChange('dayBack', val)}
                            error={errors.dayBack?.message}
                            textAlign="left"
                            iconName="calendar-outline"
                        />

                        <FormSubmitButton
                            title={translate('booking.searchBus')}
                            onPress={handleSearchBus}
                        />
                    </Card>
                </Container>

                <Gap />

                <View>
                    <RecentSearchList searches={recentSearches} />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 10,
    },
});
