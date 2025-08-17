import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import dayjs from 'dayjs';

interface DateItem {
    id: string;
    date: dayjs.Dayjs;
}

interface HorizontalDateSelectorProps {
    value: string; // controlled value (YYYY-MM-DD)
    onChange?: (date: string) => void; // callback
    prevDays?: number; // how many days before
    nextDays?: number; // how many days after
}

const HorizontalDateSelector: React.FC<HorizontalDateSelectorProps> = ({
    value,
    onChange,
    prevDays = 3,
    nextDays = 3,
}) => {
    const flatListRef = useRef<FlatList<DateItem>>(null);

    // Generate date range around "value"
    const dates: DateItem[] = useMemo(() => {
        const center = dayjs(value);
        return Array.from({ length: prevDays + nextDays + 1 }, (_, i) => {
            const offset = i - prevDays;
            const date = center.add(offset, 'day');
            return { id: date.format('YYYY-MM-DD'), date };
        });
    }, [value, prevDays, nextDays]);

    // Always scroll to selected date
    useEffect(() => {
        const index = dates.findIndex((d) => d.id === value);
        if (index !== -1 && flatListRef.current) {
            setTimeout(() => {
                flatListRef.current?.scrollToIndex({
                    index,
                    animated: true,
                    viewPosition: 0.5, // center horizontally
                });
            }, 50);
        }
    }, [value, dates]);

    const handlePress = (date: string) => {
        onChange?.(date);
    };

    const renderItem = ({ item }: { item: DateItem }) => {
        const isSelected = item.id === value;
        return (
            <TouchableOpacity
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => handlePress(item.id)}
            >
                <Text style={[styles.weekday, isSelected && styles.textSelected]}>
                    {item.date.format('ddd')}
                </Text>
                <Text style={[styles.dayMonth, isSelected && styles.textSelected]}>
                    {item.date.format('DD/MM')}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                horizontal
                data={dates}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                getItemLayout={(_, index) => ({
                    length: 82,
                    offset: 82 * index,
                    index,
                })}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
    },
    card: {
        padding: 12,
        marginHorizontal: 6,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        minWidth: 70,
    },
    cardSelected: {
        backgroundColor: '#4a90e2',
    },
    weekday: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    dayMonth: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    textSelected: {
        color: '#fff',
    },
});

export default HorizontalDateSelector;
