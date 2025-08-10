import { useTheme } from '@context/ThemeContext';
import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface ScreenWrapperProps {
    children: ReactNode;
    style?: ViewStyle;
}

const ScreenWrapper = ({ children, style }: ScreenWrapperProps) => {
    const { theme } = useTheme();

    return (
        <View
            style={[
                {
                    flex: 1,
                    backgroundColor: theme.colors.background,
                    paddingVertical: theme.spacing.sm,
                    paddingHorizontal: theme.spacing.lg,
                },
                style,
            ]}
        >
            {children}
        </View>
    );
};

export default ScreenWrapper;
