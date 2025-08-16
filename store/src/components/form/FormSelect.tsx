import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, TextInput } from 'react-native';
import { Controller } from 'react-hook-form';
import { useTheme } from '@context/ThemeContext';
import type { FormSelectProps, Options } from '@types';
import Icon from '@components/global/icon/Icon';
import Typography from '@components/global/typography/Typography';

export const FormSelect: React.FC<FormSelectProps> = ({
    name,
    label,
    control,
    error,
    options,
    placeholder,
    containerStyle,
    iconName,
}) => {
    const { theme } = useTheme();
    const [modalVisible, setModalVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredOptions = options.filter((option: Options) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                <Typography
                    variant="caption"
                    style={{ marginBottom: theme.spacing.xs, color: theme.colors.labelInput }}
                >
                    {label}
                </Typography>
            ) : null}

            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, value } }) => {
                    const selected = options.find((o) => o.value === value);
                    return (
                        <>
                            <TouchableOpacity
                                onPress={() => setModalVisible(true)}
                                style={{
                                    backgroundColor: theme.colors.inputBackground,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                {/* {iconName && (
                                    <Icon
                                        name={iconName}
                                        style={{ marginRight: theme.spacing.xs }}
                                    />
                                )} */}

                                <Typography
                                    variant="body"
                                    style={{
                                        color: selected
                                            ? theme.colors.text
                                            : theme.colors.placeholder,
                                    }}
                                >
                                    {selected ? selected.label : placeholder || 'Select...'}
                                </Typography>
                                {/* <Text
                                    style={{
                                        color: selected
                                            ? theme.colors.text
                                            : theme.colors.placeholder,
                                    }}
                                >
                                    {selected ? selected.label : placeholder || 'Select...'}
                                </Text> */}
                            </TouchableOpacity>

                            <Modal visible={modalVisible} animationType="fade" transparent>
                                <View style={styles.modalOverlay}>
                                    <View
                                        style={[
                                            styles.modalContent,
                                            {
                                                backgroundColor: theme.colors.background,
                                                borderRadius: theme.radius.md,
                                            },
                                        ]}
                                    >
                                        <TextInput
                                            style={{
                                                borderColor: theme.colors.border,
                                                borderWidth: 1,
                                                padding: theme.spacing.sm,
                                                marginBottom: theme.spacing.sm,
                                                borderRadius: theme.radius.sm,
                                                color: theme.colors.text,
                                            }}
                                            placeholder="Search..."
                                            placeholderTextColor={theme.colors.placeholder}
                                            value={searchTerm}
                                            onChangeText={setSearchTerm}
                                        />
                                        <FlatList
                                            data={filteredOptions}
                                            keyExtractor={(item) => String(item.value)}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        onChange(item.value);
                                                        setModalVisible(false);
                                                        setSearchTerm('');
                                                    }}
                                                    style={{
                                                        padding: theme.spacing.sm,
                                                        borderBottomWidth: 1,
                                                        borderBottomColor: theme.colors.border,
                                                    }}
                                                >
                                                    <Text style={{ color: theme.colors.text }}>
                                                        {item.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                        />
                                        <TouchableOpacity
                                            onPress={() => setModalVisible(false)}
                                            style={{
                                                padding: theme.spacing.sm,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Text style={{ color: theme.colors.error }}>
                                                Cancel
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
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

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        maxHeight: '80%',
        padding: 16,
    },
});
