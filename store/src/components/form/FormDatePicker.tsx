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
import Icon from '@components/global/icon/Icon';
import type { FormDatePickerProps } from '@types';
import Typography from '@components/global/typography/Typography';

export const FormDatePicker: React.FC<FormDatePickerProps> = ({
    name,
    label,
    control,
    error,
    placeholder = 'Select date',
    containerStyle,
    iconName,
}) => {
    const { theme } = useTheme();
    const [showPicker, setShowPicker] = useState(false);

    return (
        <View
            style={[
                {
                    marginBottom: theme.spacing.md,
                    borderWidth: 1,
                    borderColor: error ? theme.colors.error : theme.colors.border,
                    borderRadius: theme.radius.sm,
                    padding: theme.spacing.sm,
                },
                containerStyle,
            ]}
        >
            {label ? (
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Typography
                        variant="caption"
                        style={{ marginBottom: theme.spacing.xs, color: theme.colors.labelInput }}
                    >
                        {label}
                    </Typography>
                </View>
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
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                {iconName && (
                                    <Icon
                                        name={iconName}
                                        style={{ marginRight: theme.spacing.xs }}
                                    />
                                )}

                                {/* <Text
                                    wi
                                    style={{
                                        color: value ? theme.colors.text : theme.colors.placeholder,
                                    }}
                                >
                                    {displayValue}
                                </Text> */}
                                <Typography
                                    variant="body"
                                    weight="bold"
                                    style={{
                                        color: value ? theme.colors.text : theme.colors.placeholder,
                                    }}
                                >
                                    {displayValue}
                                </Typography>
                            </TouchableOpacity>

                            {showPicker &&
                                (Platform.OS === 'web' ? (
                                    <input
                                        type="date"
                                        value={value ? value.split('T')[0] : ''}
                                        onChange={(e) => {
                                            setShowPicker(false);
                                            onChange(new Date(e.target.value).toISOString());
                                        }}
                                        style={{ padding: 8, fontSize: 16 }}
                                    />
                                ) : (
                                    <DateTimePicker
                                        value={value ? new Date(value) : new Date()}
                                        mode="date"
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={handleChange}
                                    />
                                ))}
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
