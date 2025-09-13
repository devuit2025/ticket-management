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
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import BookingReviewInfoSections from '@components/booking/BookingReviewInfoSections';

type Props = NativeStackScreenProps<BookingStackParamList, 'BookingConfirmation'>;

export default function BookingConfirmationScreen({ navigation }: Props) {
    const { theme } = useTheme();
    const { translate } = useTranslation();
    const { bookingData } = useBooking();
    const viewRef = useRef<any>(null);
    console.log(bookingData);
    const qrInfo = bookingData;

    const handleBackHome = () => navigation.navigate('Home');

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
                                value={qrInfo.bookingRef}
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
                        <BookingReviewInfoSections></BookingReviewInfoSections>
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
