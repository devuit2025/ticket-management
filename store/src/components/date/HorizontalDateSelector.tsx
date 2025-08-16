import React, { useRef, useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    NativeScrollEvent,
    NativeSyntheticEvent,
} from 'react-native';
import { useTheme } from '@context/ThemeContext';

interface HorizontalDateSelectorProps {
    recentDate: Date;
    selectedDate: Date | null;
    onSelect: (date: Date) => void;
    visibleBoxes?: number; // how many visible boxes
}

const screenWidth = Dimensions.get('window').width;
const boxSpacing = 12; // margin between boxes

const HorizontalDateSelector: React.FC<HorizontalDateSelectorProps> = ({
    recentDate,
    selectedDate,
    onSelect,
    visibleBoxes = 5,
}) => {
    const { theme } = useTheme();
    const flatListRef = useRef<FlatList>(null);

    const boxWidth = (screenWidth - boxSpacing * (visibleBoxes - 1) - 32) / visibleBoxes;

    const generateDates = (startDate: Date, count: number, direction: 'forward' | 'backward') => {
        const dates: Date[] = [];
        for (let i = 1; i <= count; i++) {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + (direction === 'forward' ? i : -i));
            dates.push(d);
        }
        return direction === 'forward' ? dates : dates.reverse();
    };

    // Initial window: recentDate +/- 3 days
    const [dates, setDates] = useState<Date[]>([
        ...generateDates(recentDate, Math.floor(visibleBoxes / 2), 'backward'),
        recentDate,
        ...generateDates(recentDate, Math.floor(visibleBoxes / 2), 'forward'),
    ]);

    // Auto-scroll selected date
    useEffect(() => {
        if (!selectedDate) return;
        const index = dates.findIndex((d) => d.toDateString() === selectedDate.toDateString());
        if (index >= 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToIndex({
                    index,
                    animated: true,
                    viewPosition: 0.5,
                });
            }, 100);
        }
    }, [selectedDate, dates]);

    const prependDates = () => {
        const first = dates[0];
        const newDates = generateDates(first, visibleBoxes, 'backward');
        setDates((prev) => [...newDates, ...prev]);
    };

    const appendDates = () => {
        const last = dates[dates.length - 1];
        const newDates = generateDates(last, visibleBoxes, 'forward');
        setDates((prev) => [...prev, ...newDates]);
    };

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;

        // If close to left edge, prepend
        if (contentOffset.x < boxWidth * 2) {
            prependDates();
        }

        // If close to right edge, append
        if (contentOffset.x + layoutMeasurement.width > contentSize.width - boxWidth * 2) {
            appendDates();
        }
    };

    const renderItem = ({ item }: { item: Date }) => {
        const isSelected = selectedDate?.toDateString() === item.toDateString();
        const dayName = item.toLocaleDateString(undefined, { weekday: 'short' });
        const dayNumber = item.getDate();
        const monthNumber = item.getMonth() + 1;

        return (
            <TouchableOpacity
                style={[
                    styles.dateBlock,
                    {
                        backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                        width: boxWidth,
                    },
                ]}
                onPress={() => onSelect(item)}
            >
                <Text
                    style={{
                        color: isSelected ? theme.colors.onPrimary : theme.colors.onSurface,
                        fontWeight: 'bold',
                    }}
                >
                    {dayName}
                </Text>
                <Text
                    style={{ color: isSelected ? theme.colors.onPrimary : theme.colors.onSurface }}
                >
                    {dayNumber}/{monthNumber}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <FlatList
            ref={flatListRef}
            horizontal
            data={dates}
            keyExtractor={(item) => item.toISOString()}
            renderItem={renderItem}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            getItemLayout={(_, index) => ({
                length: boxWidth + boxSpacing,
                offset: (boxWidth + boxSpacing) * index,
                index,
            })}
        />
    );
};

const styles = StyleSheet.create({
    dateBlock: {
        height: 70,
        borderRadius: 12,
        marginHorizontal: boxSpacing / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default HorizontalDateSelector;
