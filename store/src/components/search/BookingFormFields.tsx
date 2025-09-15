import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormSelect } from '@components/form/FormSelect';
import { FormDatePicker } from '@components/form/FormDatePicker';
import { FormSubmitButton } from '@components/form/FormSubmitButton';
import Card from '@components/global/card/Card';
import { prepareLocations, Options } from '@utils/prepareLocations';
import { useTranslation } from '@i18n/useTranslation';
import type { BookingData } from '@types';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

interface BookingFormFieldsProps {
    onSubmit: (data: BookingData) => void;
}

export interface BookingFormFieldsRef {
    setFormValues: (data: Partial<BookingData>) => void;
    submitForm: () => void;
}

export const BookingFormFields = forwardRef<BookingFormFieldsRef, BookingFormFieldsProps>(
    ({ onSubmit }, ref) => {
        const { translate } = useTranslation();
        const [locations, setLocations] = useState<Options[]>([]);

        useEffect(() => {
            const fetchLocations = async () => {
                const result = await prepareLocations();
                setLocations(result);
            };
            fetchLocations();
        }, []);

        const schema = yup.object({
            from: yup
                .string()
                .required(translate('booking.pickupLocation') + ' ' + translate('common.required')),
            to: yup
                .string()
                .required(
                    translate('booking.dropoffLocation') + ' ' + translate('common.required')
                ),
            day: yup
                .string()
                .required(translate('booking.travelDate') + ' ' + translate('common.required')),
        });

        const {
            control,
            handleSubmit,
            formState: { errors },
            watch,
            setValue,
            reset,
        } = useForm<BookingData>({
            resolver: yupResolver(schema),
            defaultValues: {
                from: '',
                to: '',
                day: null,
                dayBack: null,
                numberOfTickets: '1',
            },
        });

        // Expose methods to parent
        useImperativeHandle(ref, () => ({
            setFormValues: (data: Partial<BookingData>) => reset({ ...data }),
            submitForm: () => handleSubmit(onSubmit)(),
        }));

        return (
            <Card>
                <FormSelect
                    name="from"
                    control={control}
                    label={translate('booking.pickupLocation')}
                    placeholder={translate('booking.pickupLocationPlaceholder')}
                    options={locations}
                    value={watch('from')}
                    onChange={(val: string) => setValue('from', val)}
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
                    value={watch('to')}
                    onChange={(val: string) => setValue('to', val)}
                    error={errors.to?.message}
                    textAlign="left"
                    iconName="location-outline"
                />

                <FormDatePicker
                    name="day"
                    control={control}
                    label={translate('booking.travelDate')}
                    placeholder={translate('booking.travelDatePlaceholder')}
                    value={watch('day')}
                    onChange={(val: string | Date | null) => setValue('day', val)}
                    error={errors.day?.message}
                    textAlign="left"
                    iconName="calendar-outline"
                />

                <FormSubmitButton
                    title={translate('booking.searchBus')}
                    onPress={handleSubmit(onSubmit)}
                />
            </Card>
        );
    }
);
