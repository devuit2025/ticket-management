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
                <Text style={[styles.buttonText, { color: theme.colors.onPrimary }]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        fontWeight: '600',
        fontSize: 16,
    },
});
