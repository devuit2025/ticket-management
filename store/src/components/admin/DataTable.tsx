import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@context/ThemeContext';
import Typography from '@components/global/typography/Typography';
import Card from '@components/global/card/Card';
import Divider from '@components/global/divider/Divider';

interface Column {
    key: string;
    title: string;
    width?: number;
    align?: 'left' | 'center' | 'right';
    render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
    columns: Column[];
    data: any[];
    onRowPress?: (row: any) => void;
    loading?: boolean;
    emptyMessage?: string;
}

export default function DataTable({ 
    columns, 
    data, 
    onRowPress, 
    loading = false,
    emptyMessage = 'Không có dữ liệu'
}: DataTableProps) {
    const { theme } = useTheme();

    const renderCell = (column: Column, row: any, index: number) => {
        const value = row[column.key];
        
        if (column.render) {
            return column.render(value, row);
        }
        
        return (
            <Typography 
                variant="body2" 
                color={theme.colors.text}
                style={[
                    styles.cellText,
                    { textAlign: column.align || 'left' }
                ]}
            >
                {value}
            </Typography>
        );
    };

    if (loading) {
        return (
            <Card>
                <View style={styles.loadingContainer}>
                    <Typography variant="body1" color={theme.colors.textSecondary}>
                        Đang tải...
                    </Typography>
                </View>
            </Card>
        );
    }

    if (data.length === 0) {
        return (
            <Card>
                <View style={styles.emptyContainer}>
                    <Typography variant="body1" color={theme.colors.textSecondary}>
                        {emptyMessage}
                    </Typography>
                </View>
            </Card>
        );
    }

    return (
        <Card>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.table}>
                    {/* Header */}
                    <View style={styles.header}>
                        {columns.map((column, index) => (
                            <View 
                                key={column.key}
                                style={[
                                    styles.headerCell,
                                    { width: column.width || 120 }
                                ]}
                            >
                                <Typography 
                                    variant="body2" 
                                    color={theme.colors.textSecondary}
                                    style={[
                                        styles.headerText,
                                        { textAlign: column.align || 'left' }
                                    ]}
                                >
                                    {column.title}
                                </Typography>
                            </View>
                        ))}
                    </View>
                    
                    <Divider />
                    
                    {/* Rows */}
                    {data.map((row, rowIndex) => (
                        <TouchableOpacity
                            key={rowIndex}
                            style={[
                                styles.row,
                                rowIndex < data.length - 1 && styles.rowWithBorder
                            ]}
                            onPress={() => onRowPress?.(row)}
                            disabled={!onRowPress}
                        >
                            {columns.map((column, colIndex) => (
                                <View 
                                    key={column.key}
                                    style={[
                                        styles.cell,
                                        { width: column.width || 120 }
                                    ]}
                                >
                                    {renderCell(column, row, rowIndex)}
                                </View>
                            ))}
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </Card>
    );
}

const styles = StyleSheet.create({
    table: {
        minWidth: '100%',
    },
    header: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(0,0,0,0.02)',
    },
    headerCell: {
        paddingHorizontal: 8,
    },
    headerText: {
        fontWeight: '600',
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    rowWithBorder: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    cell: {
        paddingHorizontal: 8,
        justifyContent: 'center',
    },
    cellText: {
        fontSize: 14,
    },
    loadingContainer: {
        padding: 32,
        alignItems: 'center',
    },
    emptyContainer: {
        padding: 32,
        alignItems: 'center',
    },
});
