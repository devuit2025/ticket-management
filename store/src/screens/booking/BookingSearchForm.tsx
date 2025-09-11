import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Card from '@components/global/card/Card';
import { FormSelect } from '@components/form/FormSelect';
import { FormDatePicker } from '@components/form/FormDatePicker';
import { FormSubmitButton } from '@components/form/FormSubmitButton';
import { useBooking } from '@context/BookingContext';
import type { BookingData } from '@types';
import { useForm } from 'react-hook-form';
import { useTranslation } from '@i18n/useTranslation';
import { prepareLocations, Options } from '@utils/prepareLocations';

interface BookingSearchFormProps {
    onSearch: () => void;
}

export const BookingSearchForm: React.FC<BookingSearchFormProps> = ({ onSearch }) => {
    const { translate } = useTranslation();
    const { bookingData, setBookingData } = useBooking();
    const [locations, setLocations] = useState<Options[]>([]);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            numberOfTickets: '1',
        },
    });

    useEffect(() => {
        const fetchLocations = async () => {
            const result = await prepareLocations();
            setLocations(result);
        };
        fetchLocations();
    }, []);

    const handleChange = (field: keyof BookingData, value: string | Date | null) => {
        setBookingData((prev: BookingData) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <Card style={styles.card}>
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
                label={translate('booking.travelDate') + ' ' + translate('booking.roundTrip')}
                placeholder={translate('booking.travelDatePlaceholder')}
                value={bookingData.dayBack}
                onChange={(val: string) => handleChange('dayBack', val)}
                error={errors.dayBack?.message}
                textAlign="left"
                iconName="calendar-outline"
            />

            <FormSubmitButton title={translate('booking.searchBus')} onPress={onSearch} />
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 10,
    },
});
