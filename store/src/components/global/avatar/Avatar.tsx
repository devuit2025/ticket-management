import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { useTheme } from '@context/ThemeContext';

interface AvatarProps {
    size?: number; // diameter
    imageUrl?: string | null;
    initials?: string;
    borderColor?: string;
    style?: ViewStyle;
    imageStyle?: ImageStyle;
    showStatus?: boolean;
    statusOnline?: boolean; // true=online, false=offline
}

const Avatar: React.FC<AvatarProps> = ({
    size = 48,
    imageUrl,
    initials,
    borderColor,
    style,
    imageStyle,
    showStatus = false,
    statusOnline = false,
}) => {
    const { theme } = useTheme();

    const containerStyle: ViewStyle = {
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: borderColor ? 2 : 0,
        borderColor: borderColor || 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        overflow: 'hidden',
    };

    const textStyle = {
        color: theme.colors.text,
        fontSize: size / 2.5,
        fontWeight: '600',
    };

    const statusColor = statusOnline ? '#4CAF50' : '#B0B0B0'; // green or gray

    return (
        <View style={[containerStyle, style]}>
            {imageUrl ? (
                <Image
                    source={{ uri: imageUrl }}
                    style={[
                        styles.image,
                        { width: size, height: size, borderRadius: size / 2 },
                        imageStyle,
                    ]}
                />
            ) : (
                <Text style={textStyle}>{initials?.toUpperCase() || '?'}</Text>
            )}
            {showStatus && (
                <View
                    style={[
                        styles.status,
                        {
                            backgroundColor: statusColor,
                            width: size / 4,
                            height: size / 4,
                            borderRadius: size / 8,
                            right: 2,
                            bottom: 2,
                        },
                    ]}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        resizeMode: 'cover',
    },
    status: {
        position: 'absolute',
        borderWidth: 1.5,
        borderColor: '#fff',
    },
});

export default Avatar;
