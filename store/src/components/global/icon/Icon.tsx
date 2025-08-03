import React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@context/ThemeContext';

export type IconType = 'ion' | 'material' | 'fa';

export type IconSize = 'sm' | 'md' | 'lg' | number;

export interface IconProps {
    name: string;
    type?: IconType;
    size?: IconSize;
    color?: string;
    style?: StyleProp<TextStyle | ViewStyle>;
}

const getSize = (size: IconSize = 'md'): number => {
    const { theme } = useTheme();
    if (typeof size === 'number') return size;

    switch (size) {
        case 'sm':
            return theme.fonts.sizes.sm;
        case 'lg':
            return theme.fonts.sizes.lg;
        default:
            return theme.fonts.sizes.md;
    }
};

const Icon: React.FC<IconProps> = ({ name, type = 'ion', size = 'md', color, style }) => {
    const { theme } = useTheme();
    const iconColor = color || theme.colors.text;
    const iconSize = getSize(size);

    switch (type) {
        case 'material':
            return (
                <MaterialIcons name={name as any} size={iconSize} color={iconColor} style={style} />
            );
        case 'fa':
            return (
                <FontAwesome name={name as any} size={iconSize} color={iconColor} style={style} />
            );
        case 'ion':
        default:
            return <Ionicons name={name as any} size={iconSize} color={iconColor} style={style} />;
    }
};

export default Icon;
