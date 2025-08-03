import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@context/ThemeContext';

interface ProgressLoaderProps {
    progress: number; // value from 0 to 1
    label?: string;
    style?: ViewStyle;
}

const ProgressLoader: React.FC<ProgressLoaderProps> = ({ progress, label, style }) => {
    const { theme } = useTheme();
    const percent = Math.min(Math.max(progress, 0), 1);

    return (
        <View style={[styles.container, style]}>
            {label && <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>}
            <View style={[styles.bar, { backgroundColor: theme.colors.border }]}>
                <View
                    style={[
                        styles.progress,
                        {
                            width: `${percent * 100}%`,
                            backgroundColor: theme.colors.primary,
                        },
                    ]}
                />
            </View>
            <Text style={[styles.percent, { color: theme.colors.text }]}>
                {Math.round(percent * 100)}%
            </Text>
        </View>
    );
};

export default ProgressLoader;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 12,
    },
    label: {
        marginBottom: 4,
        fontSize: 14,
        fontWeight: '500',
    },
    bar: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progress: {
        height: '100%',
        borderRadius: 4,
    },
    percent: {
        marginTop: 4,
        fontSize: 12,
        textAlign: 'right',
    },
});
