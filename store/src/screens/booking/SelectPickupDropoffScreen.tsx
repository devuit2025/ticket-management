import React from 'react';
import { MainLayout } from '@components/layouts/MainLayout';
import { FormSelect } from '@components/form/FormSelect';
import { FormDatePicker } from '@components/form/FormDatePicker';
import { FormSubmitButton } from '@components/form/FormSubmitButton';
import { useBooking } from '@context/BookingContext';
import type { BookingData, Options } from '@types';
import { useForm } from 'react-hook-form';
import { useTranslation } from '@i18n/useTranslation';
import Card from '@components/global/card/Card';
import Typography from '@components/global/typography/Typography';
import { ScrollView, StyleSheet, View } from 'react-native';
import Divider from '@components/global/divider/Divider';
import Gap from '@components/global/gap/Gap';

const locations: Options[] = [
    { label: 'Hanoi', value: 'hanoi' },
    { label: 'Ho Chi Minh City', value: 'hcmc' },
];

export default function SelectPickupDropoffScreen() {
    const { translate } = useTranslation();

    const ticketLabel = translate('booking.ticket');
    const ticketNumbers: Options[] = Array.from({ length: 10 }, (_, i) => ({
        label: `${i + 1} ` + ticketLabel,
        value: `${i + 1}`,
    }));

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

    const recentSearch = {
        from: 'Saigon',
        to: 'Da Lat',
        day: '2025-08-20',
        dayBack: '2025-08-25', // optional
    };

    return (
        <MainLayout withPadding>
            <ScrollView
                style={[
                    {
                        // scrollbarWidth: 'none',
                        // msOverflowStyle: 'none',
                    },
                ]}
            >
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
                            translate('booking.travelDate') + ' ' + translate('booking.roundTrip')
                        }
                        placeholder={translate('booking.travelDatePlaceholder')}
                        value={bookingData.dayBack}
                        onChange={(val: string) => handleChange('dayBack', val)}
                        error={errors.dayBack?.message}
                        textAlign="left"
                        iconName="calendar-outline"
                    />

                    {/* <FormSelect
                        name="numberOfTickets"
                        control={control}
                        label={translate('booking.numberOfTickets')}
                        placeholder={translate('booking.numberOfTicketsPlaceholder')}
                        options={ticketNumbers}
                        value={bookingData.numberOfTickets}
                        onChange={(val: string) => handleChange('numberOfTickets', val)}
                        error={errors.numberOfTickets?.message}
                        textAlign="left"
                        iconName="ticket-outline"
                    /> */}

                    <FormSubmitButton title={translate('booking.searchBus')} />
                </Card>

                <Gap />

                <View>
                    <Typography
                        variant="h2"
                        color="black"
                        weight="bold"
                        style={{ marginBottom: 10 }}
                    >
                        {translate('booking.recentSearch')}
                    </Typography>
                    <Card style={styles.card}>
                        <Typography variant="h3" weight="bold">
                            {recentSearch.from} → {recentSearch.to}
                        </Typography>
                        <Typography variant="body" style={{ marginTop: 4 }}>
                            {translate('booking.travelDate')}: {recentSearch.day}
                            {recentSearch.dayBack
                                ? ` · ${translate('booking.roundTrip')}: ${recentSearch.dayBack}`
                                : ''}
                        </Typography>
                    </Card>
                </View>
            </ScrollView>
        </MainLayout>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 10,
    },
});
