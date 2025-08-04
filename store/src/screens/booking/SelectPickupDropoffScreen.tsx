import React from 'react';
import { View } from 'react-native';
import { useBooking } from '@context/BookingContext';
import { MainLayout } from '@components/layouts/MainLayout';
import { FormSelect } from '@components/form/FormSelect';
import { FormSubmitButton } from '@components/form/FormSubmitButton';

const locations = [
    { label: 'Hanoi', value: 'hanoi' },
    { label: 'Ho Chi Minh City', value: 'hcmc' },
];

export default function SelectPickupDropoffScreen({ navigation }) {
    const { bookingData, setBookingData } = useBooking();

    const onNext = () => {
        navigation.navigate('PassengerInfo');
        // Basic validation can be added here
        if (bookingData.pickupLocation && bookingData.dropoffLocation) {
            navigation.navigate('PassengerInfo');
        } else {
            //   alert('Please select pickup and dropoff locations');
        }
    };

    return (
        <MainLayout withPadding>
            {/* select 1

        select 2 */}
            <FormSubmitButton title="Next" onPress={onNext} />
        </MainLayout>
    );
}
