import React, { useEffect, useRef, useState } from 'react';
import type { BookingData } from '@types';
import { useTranslation } from '@i18n/useTranslation';
import Typography from '@components/global/typography/Typography';
import { ScrollView, StyleSheet, View } from 'react-native';
import Gap from '@components/global/gap/Gap';
import { useTheme } from '@context/ThemeContext';
import Container from '@components/global/container/Container';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { RecentSearchList } from '@components/search/RecentSearchList';
import { BookingFormFields, BookingFormFieldsRef } from '@components/search/BookingFormFields';
import { getRecentSearches, addRecentSearch, StoredSearch } from '@utils/recentSearchStorage';
import { useBooking } from '@context/BookingContext';

interface SelectPickupDropoffScreenProps {
    navigation: NavigationProp<Record<string, object | undefined>>;
    route: RouteProp<Record<string, object | undefined>, string>;
}

export default function SelectPickupDropoffScreen({
    navigation,
    route,
}: SelectPickupDropoffScreenProps) {
    const [recentSearches, setRecentSearches] = useState<StoredSearch[]>([]);
    const { bookingData, setBookingData } = useBooking();

    // Load recent searches on mount
    useEffect(() => {
        (async () => {
            const stored = await getRecentSearches();
            setRecentSearches(stored);
        })();
    }, []);

    const { translate } = useTranslation();
    const { theme } = useTheme();
    const formRef = useRef<BookingFormFieldsRef>(null);

    const handleFormSubmit = async (data: BookingData) => {
        setBookingData(data);

        // Save to storage
        await addRecentSearch(data);

        // Reload recent searches
        const updated = await getRecentSearches();
        setRecentSearches(updated);

        navigation.navigate('Booking');
    };

    const handleRecentSearchClick = async (search: Partial<BookingData>) => {
        formRef.current?.setFormValues(search);

        // Optionally save/update recent search in storage
        await addRecentSearch(search);

        // Submit form immediately
        formRef.current?.submitForm();
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

                    <BookingFormFields ref={formRef} onSubmit={handleFormSubmit} />
                </Container>

                <Gap />

                <View>
                    <RecentSearchList
                        searches={recentSearches}
                        onSearchClick={handleRecentSearchClick}
                    />
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
