import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { useBooking } from '@context/BookingContext';
import { useTheme } from '@context/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookingStackParamList } from '@navigation/BookingNavigator';
import Container from '@components/global/container/Container';
import Card from '@components/global/card/Card';
import HorizontalDateSelector from '@components/date/HorizontalDateSelector';
import Select from '@components/global/select/Select';
import Typography from '@components/global/typography/Typography';
import { useTranslation } from '@i18n/useTranslation';
import BusCard from '@components/bus/BusCard';

type Props = NativeStackScreenProps<BookingStackParamList, 'SelectBus'>;

export default function SelectBusScreen({ navigation }: Props) {
    const { translate } = useTranslation();
    const { bookingData } = useBooking();
    const { theme } = useTheme();

    const goToSeatSelect = () => {
        console.log('go to seat');
        navigation.navigate('SelectSeat');
    };

    const [selected, setSelected] = useState('2025-08-17');
    const [fruit, setFruit] = useState<string | undefined>(undefined);
    const [color, setColor] = useState<string | undefined>(undefined);
    const [animal, setAnimal] = useState<string | undefined>(undefined);

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            {/* ✅ ScrollView wraps all content */}
            <ScrollView
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
            >
                <Container style={{ marginTop: 15 }}>
                    {/* Filters Card */}
                    <Card style={{ marginBottom: 15 }}>
                        <HorizontalDateSelector value={selected} onChange={(d) => setSelected(d)} />

                        <View style={[styles.container, { marginTop: 15 }]}>
                            {/* Column 1 */}
                            <View style={styles.column}>
                                <Text style={styles.label}>Fruit</Text>
                                <Select
                                    options={[
                                        { label: 'Apple', value: 'apple' },
                                        { label: 'Banana', value: 'banana' },
                                        { label: 'Orange', value: 'orange' },
                                    ]}
                                    value={fruit}
                                    onChange={setFruit}
                                    placeholder="Choose fruit"
                                />
                            </View>

                            {/* Column 2 */}
                            <View style={styles.column}>
                                <Text style={styles.label}>Color</Text>
                                <Select
                                    options={[
                                        { label: 'Red', value: 'red' },
                                        { label: 'Green', value: 'green' },
                                        { label: 'Blue', value: 'blue' },
                                    ]}
                                    value={color}
                                    onChange={setColor}
                                    placeholder="Choose color"
                                />
                            </View>

                            {/* Column 3 */}
                            <View style={styles.column}>
                                <Text style={styles.label}>Animal</Text>
                                <Select
                                    options={[
                                        { label: 'Cat', value: 'cat' },
                                        { label: 'Dog', value: 'dog' },
                                        { label: 'Bird', value: 'bird' },
                                    ]}
                                    value={animal}
                                    onChange={setAnimal}
                                    placeholder="Choose animal"
                                />
                            </View>
                        </View>
                    </Card>

                    {/* Recent Search */}
                    <Typography
                        variant="h2"
                        color="black"
                        weight="bold"
                        style={{ marginBottom: 10 }}
                    >
                        {translate('booking.recentSearch')}
                    </Typography>

                    {/* Example Bus List */}
                    {Array.from({ length: 10 }).map((_, i) => (
                        <BusCard
                            key={i}
                            startTime="08:00"
                            endTime="14:00"
                            price="350,000 VND"
                            carType="Limousine"
                            availableSeats={5}
                            startLocation="Ho Chi Minh City (Mien Dong Station)"
                            endLocation="Da Nang (Central Station)"
                            onSelect={goToSeatSelect}
                        />
                    ))}
                </Container>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    column: {
        flex: 1,
        marginHorizontal: 5,
    },
    label: {
        marginBottom: 6,
        fontWeight: 'bold',
        fontSize: 14,
    },
});
