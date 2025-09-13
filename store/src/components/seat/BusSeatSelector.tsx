import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ScrollView, Dimensions } from 'react-native';

type SeatStatus = 'available' | 'booked' | 'selected';

interface BusSeatSelectorProps {
    startDate: string;
    timeInfo: string;
    layout: string; // e.g. "2-1-2"
    seatMap: Record<string, SeatStatus>;
    onSelect: (selectedSeats: string[]) => void;
}

const BusSeatSelector: React.FC<BusSeatSelectorProps> = ({
    startDate,
    timeInfo,
    layout,
    seatMap,
    onSelect,
}) => {
    const [selected, setSelected] = useState<string[]>([]);

    const layoutGroups = layout.split('-').map((n) => parseInt(n, 10));
    const seatIds = Object.keys(seatMap).sort();
    const seatsPerRow = layoutGroups.reduce((a, b) => a + b, 0);

    const rows: string[][] = [];
    for (let i = 0; i < seatIds.length; i += seatsPerRow) {
        rows.push(seatIds.slice(i, i + seatsPerRow));
    }

    const toggleSeat = (seatId: string) => {
        const status = seatMap[seatId];
        if (status === 'booked') return;

        let updated: string[];
        if (selected.includes(seatId)) {
            updated = selected.filter((s) => s !== seatId);
        } else {
            updated = [...selected, seatId];
        }
        setSelected(updated);
        onSelect(updated);
    };

    const renderSeat = (seatId: string) => {
        const status = seatMap[seatId];
        const isSelected = selected.includes(seatId);

        return (
            <TouchableOpacity
                key={seatId}
                style={[
                    styles.seat,
                    status === 'booked' && styles.bookedSeat,
                    isSelected && styles.selectedSeat,
                ]}
                disabled={status === 'booked'}
                onPress={() => toggleSeat(seatId)}
            >
                <Text style={styles.seatText}>{status === 'booked' ? 'X' : seatId}</Text>
            </TouchableOpacity>
        );
    };

    const windowHeight = Dimensions.get('window').height;

    return (
        <View style={styles.container}>
            {/* Header Info */}
            {/* <View style={styles.header}>
                <Text style={styles.date}>{startDate}</Text>
                <Text style={styles.time}>{timeInfo}</Text>
            </View> */}

            {/* <View style={styles.divider} /> */}

            {/* Driver + Door */}
            <View style={styles.driverRow}>
                <View style={styles.driverBox}>
                    <Text style={styles.driverText}>Driver</Text>
                </View>
                <View style={styles.doorBox}>
                    <Text style={styles.doorText}>Door</Text>
                </View>
            </View>

            {/* Seat Rows */}
            {/* {rows.map((row, rowIndex) => {
                let index = 0;
                return (
                    <View key={rowIndex} style={styles.row}>
                        {layoutGroups.map((group, gIndex) => {
                            const groupSeats = row.slice(index, index + group);
                            index += group;
                            return (
                                <View key={gIndex} style={styles.group}>
                                    {groupSeats.map((seatId) => renderSeat(seatId))}
                                </View>
                            );
                        })}
                    </View>
                );
            })} */}

            {/* Seat Rows inside ScrollView */}
            <ScrollView
                // style={{ flex: 1 }}
                style={{ maxHeight: windowHeight * 0.45 }} // or adjust percentage
                contentContainerStyle={{ paddingVertical: 12 }}
            >
                {rows.map((row, rowIndex) => {
                    let index = 0;
                    return (
                        <View key={rowIndex} style={styles.row}>
                            {layoutGroups.map((group, gIndex) => {
                                const groupSeats = row.slice(index, index + group);
                                index += group;
                                return (
                                    <View key={gIndex} style={styles.group}>
                                        {groupSeats.map((seatId) => renderSeat(seatId))}
                                    </View>
                                );
                            })}
                        </View>
                    );
                })}
            </ScrollView>

            {/* Legend */}
            <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                    <View style={[styles.seat, { backgroundColor: '#f2f2f2' }]} />
                    <Text style={styles.legendText}>Available</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.seat, styles.selectedSeat]} />
                    <Text style={styles.legendText}>Selected</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.seat, styles.bookedSeat]} />
                    <Text style={styles.legendText}>Booked</Text>
                </View>
            </View>
        </View>
    );
};

export default BusSeatSelector;

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    header: {
        alignItems: 'center',
        marginBottom: 12,
    },
    date: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    time: {
        fontSize: 14,
        color: '#777',
    },
    divider: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 12,
    },
    driverRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingHorizontal: 32,
    },
    driverBox: {
        padding: 12,
        backgroundColor: '#444',
        borderRadius: 8,
    },
    driverText: {
        color: 'white',
        fontWeight: '600',
    },
    doorBox: {
        padding: 12,
        backgroundColor: '#2196F3',
        borderRadius: 8,
    },
    doorText: {
        color: 'white',
        fontWeight: '600',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 12,
    },
    group: {
        flexDirection: 'row',
        marginHorizontal: 12, // aisle spacing
    },
    seat: {
        width: 50,
        height: 50,
        marginHorizontal: 4,
        borderRadius: 12,
        backgroundColor: '#f2f2f2',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    bookedSeat: {
        backgroundColor: '#ccc',
    },
    selectedSeat: {
        backgroundColor: '#4CAF50',
    },
    seatText: {
        fontWeight: '600',
        color: '#333',
    },
    legendContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    legendItem: {
        alignItems: 'center',
    },
    legendText: {
        marginTop: 4,
        fontSize: 12,
        color: '#555',
    },
});
