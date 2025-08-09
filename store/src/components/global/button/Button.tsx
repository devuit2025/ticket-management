import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    GestureResponderEvent,
    StyleProp,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { useTheme } from '@context/ThemeContext';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface ButtonProps {
    title: string;
    onPress?: (event: GestureResponderEvent) => void;
    variant?: ButtonVariant;
    disabled?: boolean;
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    testID?: string;
}

const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    loading = false,
    style,
    textStyle,
    testID,
}) => {
    const { theme } = useTheme();

    // Colors based on variant and disabled state
    const backgroundColors = {
        primary: theme.colors.primary,
        secondary: theme.colors.secondary, // white or bg
        outline: 'transparent',
        disabled: theme.colors.disabledBackground || '#ccc',
    };

    const textColors = {
        primary: theme.colors.onPrimary || '#fff',
        secondary: theme.colors.onSecondary,
        outline: theme.colors.primary,
        disabled: theme.colors.disabledText || '#888',
    };

    // Border for outline variant
    const borderColor = variant === 'outline' ? theme.colors.primary : 'transparent';

    // Determine if button should be disabled (either disabled or loading)
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            testID={testID}
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.7}
            style={[
                styles.button,
                {
                    backgroundColor: isDisabled
                        ? backgroundColors.disabled
                        : backgroundColors[variant],
                    borderColor: borderColor,
                    borderWidth: variant === 'outline' ? 1.5 : 0,
                    borderRadius: theme.radius.md,
                    paddingVertical: theme.spacing.sm,
                    paddingHorizontal: theme.spacing.lg,
                },
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={textColors[variant]}
                    testID={`${testID}-loader`}
                />
            ) : (
                <Text
                    style={[
                        styles.text,
                        {
                            color: isDisabled ? textColors.disabled : textColors[variant],
                            fontFamily: theme.fonts.regular,
                            fontSize: theme.fonts.sizes.md,
                        },
                        textStyle,
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        minWidth: 120,
        maxWidth: 250,
        minHeight: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        textAlign: 'center',
    },
});

export default Button;
