import React, { forwardRef } from 'react';
import {
    TextInput as RNTextInput,
    TextInputProps as RNTextInputProps,
    StyleSheet,
    View,
    Text,
} from 'react-native';
import { useTheme } from '@context/ThemeContext';

export interface TextInputProps extends RNTextInputProps {
    label?: string;
    error?: string;
    helperText?: string;
}

const TextInput = forwardRef<RNTextInput, TextInputProps>(
    ({ label, error, helperText, style, ...rest }, ref) => {
        const { theme } = useTheme();

        const borderColor = error ? theme.colors.error : theme.colors.border;

        return (
            <View style={[styles.container, { marginVertical: theme.spacing.md }]}>
                {label ? (
                    <Text
                        style={[
                            styles.label,
                            {
                                color: theme.colors.text,
                                fontFamily: theme.fonts.medium,
                                fontSize: theme.fonts.sizes.md,
                                marginBottom: theme.spacing.xs,
                            },
                        ]}
                    >
                        {label}
                    </Text>
                ) : null}
                <RNTextInput
                    ref={ref}
                    style={[
                        styles.input,
                        {
                            borderColor,
                            color: theme.colors.text,
                            borderRadius: theme.radius.md,
                            paddingHorizontal: theme.spacing.sm,
                            fontFamily: theme.fonts.regular,
                            fontSize: theme.fonts.sizes.lg,
                            height: 44,
                        },
                        style,
                    ]}
                    placeholderTextColor={theme.colors.placeholder}
                    {...rest}
                />
                {error ? (
                    <Text
                        style={[
                            styles.errorText,
                            {
                                color: theme.colors.error,
                                fontFamily: theme.fonts.regular,
                                fontSize: theme.fonts.sizes.sm,
                                marginTop: theme.spacing.xs,
                            },
                        ]}
                    >
                        {error}
                    </Text>
                ) : helperText ? (
                    <Text
                        style={[
                            styles.helperText,
                            {
                                color: theme.colors.text,
                                opacity: 0.7,
                                fontFamily: theme.fonts.regular,
                                fontSize: theme.fonts.sizes.sm,
                                marginTop: theme.spacing.xs,
                            },
                        ]}
                    >
                        {helperText}
                    </Text>
                ) : null}
            </View>
        );
    }
);

export default TextInput;

const styles = StyleSheet.create({
    container: {
        // marginVertical moved to inline with coreTokens
    },
    label: {
        // font styles moved inline from coreTokens
    },
    input: {
        borderWidth: 1,
        // other styles moved inline from coreTokens
    },
    errorText: {
        // font styles moved inline
    },
    helperText: {
        // font styles moved inline
    },
});
