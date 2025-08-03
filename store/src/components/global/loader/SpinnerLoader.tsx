import React from 'react';
import { ActivityIndicator, StyleProp, View, ViewStyle } from 'react-native';
import { useTheme } from '@context/ThemeContext';

interface SpinnerLoaderProps {
    size?: 'small' | 'large';
    color?: string;
    style?: StyleProp<ViewStyle>;
}

const SpinnerLoader: React.FC<SpinnerLoaderProps> = ({ size = 'large', color, style }) => {
    const { theme } = useTheme();
    return (
        <View style={[{ justifyContent: 'center', alignItems: 'center', padding: 16 }, style]}>
            <ActivityIndicator size={size} color={color || theme.colors.primary} />
        </View>
    );
};

export default SpinnerLoader;
