import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '@context/ThemeContext';

interface FormSubmitButtonProps {
    onPress: () => void;
    title: string;
    isSubmitting?: boolean;
}

export const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({
    onPress,
    title,
    isSubmitting = false,
}) => {
    const { theme } = useTheme();

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    borderWidth: 0,
                    borderRadius: theme.radius.md,
                    paddingVertical: theme.spacing.sm,
                    paddingHorizontal: theme.spacing.lg,
                    backgroundColor: isSubmitting
                        ? theme.colors.disabledBackground
                        : theme.colors.primary,
                },
            ]}
            onPress={onPress}
            disabled={isSubmitting}
            activeOpacity={0.8}
        >
            {isSubmitting ? (
                <ActivityIndicator color={theme.colors.onPrimary} />
            ) : (
                <Text
                    style={[
                        styles.buttonText,
                        {
                            color: theme.colors.onPrimary,
                            fontFamily: theme.fonts.regular,
                            fontSize: theme.fonts.sizes.md,
                        },
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
        // paddingVertical: 14,
        // borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
    },
});
