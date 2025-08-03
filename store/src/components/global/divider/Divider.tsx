import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@context/ThemeContext';

interface DividerProps {
    thickness?: number;
    color?: string;
    style?: ViewStyle;
    marginVertical?: number;
    marginHorizontal?: number;
}

const Divider: React.FC<DividerProps> = ({
    thickness = StyleSheet.hairlineWidth,
    color,
    style,
    marginVertical = 8,
    marginHorizontal = 0,
}) => {
    const { theme } = useTheme();

    return (
        <View
            style={[
                {
                    height: thickness,
                    backgroundColor: color || theme.colors.border,
                    marginVertical,
                    marginHorizontal,
                },
                style,
            ]}
        />
    );
};

export default Divider;
