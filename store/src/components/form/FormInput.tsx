import React from 'react';
import { Controller, Control } from 'react-hook-form';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TextInputProps,
    StyleProp,
    ViewStyle,
} from 'react-native';
import { useTheme } from '@context/ThemeContext';

interface FormInputProps extends TextInputProps {
    name: string;
    label: string;
    control: Control<any>;
    error?: string;
    containerStyle?: StyleProp<ViewStyle>;
}

export const FormInput: React.FC<FormInputProps> = ({
    name,
    label,
    control,
    error,
    containerStyle,
    ...rest
}) => {
    const { theme } = useTheme();

    return (
        <View style={[styles.wrapper, { marginBottom: theme.spacing.md }, containerStyle]}>
            {label ? (
                <Text
                    style={[
                        styles.label,
                        { color: theme.colors.text, marginBottom: theme.spacing.xs },
                    ]}
                >
                    {label}
                </Text>
            ) : null}
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: theme.colors.inputBackground,
                                borderColor: error ? theme.colors.error : theme.colors.border,
                                borderRadius: theme.radius.sm,
                                padding: theme.spacing.sm,
                                color: theme.colors.text,
                            },
                            error && { borderColor: theme.colors.error },
                        ]}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholderTextColor={theme.colors.placeholder}
                        {...rest}
                    />
                )}
            />
            {error ? (
                <Text
                    style={[
                        styles.errorText,
                        { color: theme.colors.error, marginTop: theme.spacing.xs },
                    ]}
                >
                    {error}
                </Text>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        // marginBottom is handled by theme spacing dynamically
    },
    label: {
        fontWeight: '600',
        fontSize: 14,
    },
    input: {
        borderWidth: 1,
        fontSize: 16,
    },
    errorText: {
        fontSize: 12,
    },
});
