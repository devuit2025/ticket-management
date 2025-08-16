import React from 'react';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@context/ThemeContext';

export type IconType = 'ion' | 'material' | 'fa' | 'mc';
export type IconSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export interface IconProps {
    name: string;
    type?: IconType;
    size?: IconSize;
    color?: string;
    style?: StyleProp<TextStyle | ViewStyle>;
    backgroundStyle?: 'white-circle' | 'primary-circle'; // extendable
}

const getSize = (size: IconSize = 'md'): number => {
    const { theme } = useTheme();
    switch (size) {
        case 'sm':
            return theme.fonts.sizes.sm;
        case 'lg':
            return theme.fonts.sizes.lg;
        case 'xl':
            return theme.fonts.sizes.xl;
        case 'xxl':
            return theme.fonts.sizes.xxl;
        default:
            return theme.fonts.sizes.md;
    }
};

const Icon: React.FC<IconProps> = ({
    name,
    type = 'ion',
    size = 'md',
    color,
    style,
    backgroundStyle,
}) => {
    const { theme } = useTheme();
    const iconColor = color || theme.colors.icon;
    const iconSize = getSize(size);

    // Define background wrapper styles
    const wrapperStyle: StyleProp<ViewStyle> = backgroundStyle
        ? {
              justifyContent: 'center',
              alignItems: 'center',
              width: iconSize * 1.8,
              height: iconSize * 1.8,
              borderRadius: (iconSize * 1.8) / 2,
              backgroundColor:
                  backgroundStyle === 'white-circle'
                      ? '#fff'
                      : backgroundStyle === 'primary-circle'
                        ? theme.colors.primary
                        : 'transparent',
              // Add shadow if white-circle
              ...(backgroundStyle === 'white-circle'
                  ? {
                        // shadowColor: '#000',
                        // shadowOffset: { width: 0, height: 2 },
                        // shadowOpacity: 0.25,
                        // shadowRadius: 3.84,
                        // elevation: 5, // Android
                    }
                  : {}),
          }
        : {};

    const iconElement = (() => {
        switch (type) {
            case 'material':
                return (
                    <MaterialIcons
                        name={name as any}
                        size={iconSize}
                        color={iconColor}
                        style={style}
                    />
                );
            case 'fa':
                return (
                    <FontAwesome
                        name={name as any}
                        size={iconSize}
                        color={iconColor}
                        style={style}
                    />
                );
            case 'mc':
                return (
                    <MaterialCommunityIcons
                        name={name as any}
                        size={iconSize}
                        color={iconColor}
                        style={style}
                    />
                );
            case 'ion':
            default:
                return (
                    <Ionicons name={name as any} size={iconSize} color={iconColor} style={style} />
                );
        }
    })();

    return backgroundStyle ? <View style={wrapperStyle}>{iconElement}</View> : iconElement;
};

export default Icon;
