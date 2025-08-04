import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Controller, Control } from 'react-hook-form';
import { useTheme } from '@context/ThemeContext';

export interface RadioOption {
    label: string;
    value: string | number;
}

interface FormRadioGroupProps {
    name: string;
    label?: string;
    control: Control<any>;
    error?: string;
    options: RadioOption[];
    containerStyle?: StyleProp<ViewStyle>;
}

export const FormRadioGroup: React.FC<FormRadioGroupProps> = ({
    name,
    label,
    control,
    error,
    options,
    containerStyle,
}) => {
    const { theme } = useTheme();

    return (
        <View style={[{ marginBottom: theme.spacing.md }, containerStyle]}>
            {label && (
                <Text
                    style={{
                        fontWeight: '600',
                        fontSize: 14,
                        marginBottom: theme.spacing.xs,
                        color: theme.colors.text,
                    }}
                >
                    {label}
                </Text>
            )}

            <Controller
                control={control}
                name={name}
                render={({ field: { value, onChange } }) => (
                    <View style={styles.radioGroup}>
                        {options.map((option) => {
                            const selected = value === option.value;
                            return (
                                <TouchableOpacity
                                    key={option.value}
                                    style={styles.radioOption}
                                    onPress={() => onChange(option.value)}
                                    activeOpacity={0.8}
                                >
                                    <View
                                        style={[
                                            styles.outerCircle,
                                            {
                                                borderColor: selected
                                                    ? theme.colors.primary
                                                    : theme.colors.border,
                                            },
                                        ]}
                                    >
                                        {selected && (
                                            <View
                                                style={[
                                                    styles.innerCircle,
                                                    { backgroundColor: theme.colors.primary },
                                                ]}
                                            />
                                        )}
                                    </View>
                                    <Text
                                        style={{
                                            marginLeft: 8,
                                            color: theme.colors.text,
                                            fontSize: 14,
                                        }}
                                    >
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}
            />

            {error && (
                <Text
                    style={{ marginTop: theme.spacing.xs, color: theme.colors.error, fontSize: 12 }}
                >
                    {error}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    radioGroup: {
        flexDirection: 'column',
        gap: 12,
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    outerCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCircle: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
});
