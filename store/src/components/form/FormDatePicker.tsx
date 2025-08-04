import React, { useState } from 'react';
import {
    View,
    Text,
    Platform,
    TouchableOpacity,
    StyleSheet,
    StyleProp,
    ViewStyle,
} from 'react-native';
import { Controller, Control } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@context/ThemeContext';

interface FormDatePickerProps {
    name: string;
    label: string;
    control: Control<any>;
    error?: string;
    placeholder?: string;
    containerStyle?: StyleProp<ViewStyle>;
}

export const FormDatePicker: React.FC<FormDatePickerProps> = ({
    name,
    label,
    control,
    error,
    placeholder = 'Select date',
    containerStyle,
}) => {
    const { theme } = useTheme();
    const [showPicker, setShowPicker] = useState(false);

    return (
        <View style={[{ marginBottom: theme.spacing.md }, containerStyle]}>
            {label ? (
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
            ) : null}

            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, value } }) => {
                    const displayValue = value ? new Date(value).toLocaleDateString() : placeholder;

                    const handleChange = (_: any, selectedDate?: Date) => {
                        setShowPicker(false);
                        if (selectedDate) {
                            onChange(selectedDate.toISOString());
                        }
                    };

                    return (
                        <>
                            <TouchableOpacity
                                onPress={() => setShowPicker(true)}
                                style={{
                                    borderWidth: 1,
                                    borderColor: error ? theme.colors.error : theme.colors.border,
                                    backgroundColor: theme.colors.inputBackground,
                                    borderRadius: theme.radius.sm,
                                    padding: theme.spacing.sm,
                                }}
                            >
                                <Text
                                    style={{
                                        color: value ? theme.colors.text : theme.colors.placeholder,
                                    }}
                                >
                                    {displayValue}
                                </Text>
                            </TouchableOpacity>

                            {showPicker && (
                                <DateTimePicker
                                    value={value ? new Date(value) : new Date()}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={handleChange}
                                />
                            )}
                        </>
                    );
                }}
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
